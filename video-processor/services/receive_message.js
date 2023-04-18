const fs = require('fs');
const ampq = require('amqp-ts');
const {combine_images_to_video} = require("./combine_images_to_video");

const TEMP_FOLDER = 'temp';

/**
 * @param {ampq.Message} message
 */
async function receive_message(message) {
    try{
        console.log("received a new message");
        const content = JSON.parse(message.getContent());
        const CURRENT_FOLDER = await write_message_content_to_folder(content);

        const video_duration = content.images.length * 3;
        const video_name = await combine_images_to_video(
            CURRENT_FOLDER, video_duration,
            CURRENT_FOLDER, `result.mp4`);
        const video_content = get_base64_from_file(video_name);
        send_to_orchestrator(JSON.stringify({
            'token': content.token,
            'video': video_content,
        }));
        fs.rmSync(CURRENT_FOLDER, { recursive: true, force: true });

        message.ack();
    } catch (error) {
        console.error(error);
    }
}

function get_base64_from_file(file_path) {
    const buffer = fs.readFileSync(file_path);
    const ret = buffer.toString('base64');
    return ret;
}


/**
 * @param content
 * @returns {Promise<string>} folder path
 */
async function write_message_content_to_folder(content) {
    content.images = base64_arr_to_array_of_arrayBuffer(content.images);
    const token = content.token;
    const CURRENT_FOLDER = `${TEMP_FOLDER}/${token}`;

    createDirIfNotExist(TEMP_FOLDER);
    createDirIfNotExist(CURRENT_FOLDER);
    await write_array_of_arrayBuffer_to_file(CURRENT_FOLDER, content.images);
    return CURRENT_FOLDER;
}

function createDirIfNotExist(dir) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

async function write_array_of_arrayBuffer_to_file(folder, array_of_arrayBuffer) {
    for (let i = 0; i < array_of_arrayBuffer.length; i++) {
        const array_buffer = array_of_arrayBuffer[i];
        const current_file_name = i.toString().padStart(3, '0');
        const current_file_path = `${folder}/${current_file_name}.jpg`;
        await write_arrayBuffer_to_file(current_file_path, array_buffer)
    }
}

async function write_arrayBuffer_to_file(file_name, array_buffer) {
    const buffer = new Buffer.from(array_buffer);
    await fs.promises.writeFile(file_name, buffer);
}

function base64_arr_to_array_of_arrayBuffer(array_of_base64_string) {
    const ret = [];
    for (const base64_string of array_of_base64_string) {
        ret.push(base64_to_arrayBuffer(base64_string));
    }
    return ret;
}

function base64_to_arrayBuffer(base64_string) {
    return Buffer.from(base64_string, 'base64');;
}

module.exports.receive_message = receive_message;