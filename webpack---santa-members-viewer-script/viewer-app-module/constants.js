const USER_NAME_PATTERN = '{userName}'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const SOCIAL_APPS = [
    '14bcded7-0066-7c35-14d7-466cb3f09103', // blog
    '14724f35-6794-cd1a-0244-25fd138f9242', // forum
    '14f25924-5664-31b2-9568-f9c5ed98c9b1', // notifications
    '14f25dc5-6af3-5420-9568-f9c5ed98c9b1', // settings
    '14ebe801-d78a-daa9-c9e5-0286a891e46f', // followers
    '14dbef06-cc42-5583-32a7-3abd44da4908', // profile
    '140603ad-af8d-84a5-2c80-a0f60cb47351' // events
]

module.exports = {
    USER_NAME_PATTERN,
    UUID_PATTERN,
    SOCIAL_APPS
}