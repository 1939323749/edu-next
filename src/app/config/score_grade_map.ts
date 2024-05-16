const ScoreGradeMap = (score: number): number => {
    if (score >= 90) {
        return 4.0;
    } else if (score >= 87) {
        return 3.7;
    } else if (score >= 84) {
        return 3.3;
    } else if (score >= 80) {
        return 3.0;
    } else if (score >= 77) {
        return 2.7;
    } else if (score >= 74) {
        return 2.3;
    } else if (score >= 70) {
        return 2.0;
    } else if (score >= 67) {
        return 1.7;
    } else if (score >= 64) {
        return 1.3;
    } else if (score >= 60) {
        return 1.0;
    }
    return 0;
}

export default ScoreGradeMap;