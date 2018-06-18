/**
 * This class describes a message the bot sends to a slack channel
 * @param id | unique identifier of the message
 * @param content | text content of the message
 * @param moduleId | the id of the module that generated the message
 * @param timeStamp | the timestamp at which the message was generated
 * @param attachements | attechments generated to send to slack. Not persisted
 */
module.exports = class BotMessage {
    constructor(id, content, moduleId, timeStamp, attachments) {
        this._id = id;
        this._content = content;
        this._moduleId = moduleId;
        this._timeStamp = timeStamp;
        this._attachments = attachments;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }

    set content(content) {
        this._content = content;
    }

    get content() {
        return this._content;
    }

    set moduleId(moduleId) {
        this._moduleId = moduleId;
    }


    get moduleId() {
        return this._moduleId;
    }

    set timeStamp(timeStamp) {
        this._timeStamp = timeStamp;
    }

    get timeStamp() {
        return this._timeStamp;
    }

    set attachments(timeStamp) {
        this._attachments = attachments;
    }

    get attachments() {
        return this._attachments;
    }

};