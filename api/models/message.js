module.exports = class Message {
    constructor(id, content, userName, timeStamp, processed) {
        this._id = id;
        this._content = content;
        this._userName = userName;
        this._timeStamp = timeStamp;
        this._processed = processed;
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

    set userName(userName) {
        this._userName = userName;
    }


    get userName() {
        return this._userName;
    }

    set timeStamp(timeStamp) {
        this._timeStamp = timeStamp;
    }

    get timeStamp() {
        return this._timeStamp;
    }

    set processed(processed) {
        this._processed = processed;
    }

    get processed() {
        return this._processed;
    }
};