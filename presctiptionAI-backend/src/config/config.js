

module.exports.googleFitScopes = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.location.read',
    'https://www.googleapis.com/auth/fitness.blood_glucose.read',
    'https://www.googleapis.com/auth/fitness.blood_pressure.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.body_temperature.read',
    'https://www.googleapis.com/auth/fitness.nutrition.read',
    'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
    'https://www.googleapis.com/auth/fitness.sleep.read',
];

module.exports.usersScopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
]

module.exports.googleFitAggregates = [
    { dataTypeName: 'com.google.step_count.delta' },
    { dataTypeName: 'com.google.active_minutes' },
    { dataTypeName: 'com.google.activity.segment' },
    { dataTypeName: 'com.google.sleep.segment' },
    { dataTypeName: 'com.google.heart_rate.bpm' },
    { dataTypeName: 'com.google.calories.expended' },
    { dataSourceId: 'derived:com.google.height:com.google.android.gms:merge_height' },
    { dataSourceId: 'derived:com.google.weight:com.google.android.gms:merge_weight' }
]

module.exports.claudeModel = 'claude-3-5-sonnet-20240620'
module.exports.maxTokens = 1024