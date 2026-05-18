import prisma from '../lib/prisma.js';


async function getAdminTrainingAnalytics(req, res) {
    const [
        enrolledGuideRows,
        activeGuideRows,
        certRows,
        gradedAttemptRows,
        moduleRows,
        enrolmentRows,
    ] = await Promise.all([
        // distinct guides with at least one enrolment
        prisma.enrolment.findMany({
            distinct: ['guideId'],
            select: { guideId: true, guide: { select: { status: true } } },
        }),

        // guides with ACTIVE status who have at least one enrolment
        prisma.enrolment.findMany({
            distinct: ['guideId'],
            where: { guide: { status: 'ACTIVE' } },
            select: { guideId: true },
        }),

        // all certifications: which guideIds and moduleIds have certs
        prisma.certification.findMany({
            select: { guideId: true, moduleId: true },
        }),

        // all GRADED quiz attempts: quizId, guideId, totalScore
        prisma.quizAttempt.findMany({
            where: { status: 'GRADED' },
            select: {
                guideId: true,
                quizId: true,
                totalScore: true,
                quiz: { select: { moduleId: true, passScorePct: true } },
            },
        }),

        // published modules with a quiz (needed for module pass rate)
        prisma.module.findMany({
            where: { status: 'PUBLISHED' },
            select: {
                id: true,
                title: true,
                quizzes: { select: { id: true } },
            },
        }),

        // all enrolments for guide progress table
        prisma.enrolment.findMany({
            select: {
                guideId: true,
                completedAt: true,
                guide: { select: { username: true } },
            },
        }),
    ]);


    const totalEnrolledGuides = enrolledGuideRows.length;
    const activeGuides = activeGuideRows.length;
    const inactiveGuides = totalEnrolledGuides - activeGuides;

    const enrolledGuideIds = new Set(enrolledGuideRows.map(r => r.guideId));
    const certifiedGuideIds = new Set(certRows.map(r => r.guideId));

    const guidesWithCert = [...certifiedGuideIds].filter(id => enrolledGuideIds.has(id)).length;
    const certificationCompletionRate = totalEnrolledGuides > 0
        ? Math.round((guidesWithCert / totalEnrolledGuides) * 100)
        : 0;

    const summary = {
        totalEnrolledGuides,
        activeGuides,
        inactiveGuides,
        certificationCompletionRate,
    };

    const participation = [
        { name: 'Active', value: activeGuides },
        { name: 'Inactive', value: inactiveGuides },
    ];


    // guides who have at least one cert = passed
    const passedGuideIds = new Set(
        certRows.filter(r => enrolledGuideIds.has(r.guideId)).map(r => r.guideId)
    );

    // guides who have at least one graded attempt (been through the process)
    const gradedGuideIds = new Set(
        gradedAttemptRows.filter(r => enrolledGuideIds.has(r.guideId)).map(r => r.guideId)
    );

    // in progress: enrolled, no graded attempt yet
    const inProgressGuideIds = [...enrolledGuideIds].filter(id => !gradedGuideIds.has(id));

    const passed = passedGuideIds.size;
    const inProgress = inProgressGuideIds.length;
    // failed: had a graded attempt but no cert
    const failed = [...gradedGuideIds].filter(id => !passedGuideIds.has(id)).length;

    const outcomes = [
        { name: 'Passed', value: passed },
        { name: 'Failed', value: failed },
        { name: 'In Progress', value: inProgress },
    ];


    // build a map: moduleId -> set of guideIds who got certs for that module
    const certsByModule = {};
    for (const cert of certRows) {
        if (!certsByModule[cert.moduleId]) certsByModule[cert.moduleId] = new Set();
        certsByModule[cert.moduleId].add(cert.guideId);
    }

    // build a map: moduleId -> set of guideIds who had graded attempts for that module's quiz
    const gradedByModule = {};
    for (const attempt of gradedAttemptRows) {
        const mid = attempt.quiz.moduleId;
        if (!gradedByModule[mid]) gradedByModule[mid] = new Set();
        gradedByModule[mid].add(attempt.guideId);
    }

    const modulePassRates = moduleRows
        .filter(m => m.quizzes.length > 0)
        .map(m => {
            const gradedCount = gradedByModule[m.id]?.size ?? 0;
            const certCount = certsByModule[m.id]?.size ?? 0;
            const passRate = gradedCount > 0 ? Math.round((certCount / gradedCount) * 100) : 0;
            return { moduleTitle: m.title, passRate };
        });


    // group enrolments by guide
    const enrolmentsByGuide = {};
    for (const row of enrolmentRows) {
        if (!enrolmentsByGuide[row.guideId]) {
            enrolmentsByGuide[row.guideId] = {
                guideName: row.guide.username,
                enrolments: [],
            };
        }
        enrolmentsByGuide[row.guideId].enrolments.push(row);
    }

    const guideProgress = Object.entries(enrolmentsByGuide).map(([guideId, { guideName, enrolments }]) => {
        const modulesAssigned = enrolments.length;
        const modulesCompleted = enrolments.filter(e => e.completedAt !== null).length;

        let status;
        if (modulesAssigned === 0) {
            status = 'In Progress';
        } else if (modulesCompleted === modulesAssigned) {
            status = 'Completed';
        } else if (modulesCompleted / modulesAssigned < 0.5) {
            status = 'At Risk';
        } else {
            status = 'In Progress';
        }

        return { guideId, guideName, modulesAssigned, modulesCompleted, status };
    });


    return res.status(200).json({
        success: true,
        data: {
            summary,
            participation,
            outcomes,
            modulePassRates,
            guideProgress,
        },
    });
}


export { getAdminTrainingAnalytics };
