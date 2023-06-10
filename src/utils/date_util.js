function changeTimeToAMPM(hour) {
    return (hour % 12 === 0 ? 12 : hour % 12) + (hour >= 12 ? 'pm' : 'am');
}

module.exports.changeTimeToAMPM = changeTimeToAMPM;