/**
 * This class describes a module that processes messages
 * @param id | unique identifier of the message
 * @param keyWord | keyword that triggers the module to process a message
 * @param active | whether the module is active or not bool
 * @param groupKeyWord | the keyword that triggers the module if followed by keyWord
 * @param description | description of the module
 * @param pathToFile | path to the sourcecode file (relative to root path)
 * @param userName | username for the api which is triggered in the module
 * @param password | password for api
 * @param apiKey | api key for api
 */
module.exports = class BotModule {

    constructor(id, name, keyWord, active, groupKeyWord, description, pathToFile, userName, password, apiKey) {
        this._id = id;
        this._name = name;
        this._keyWord = keyWord;
        this._active = active;
        this._groupKeyWord = groupKeyWord;
        this._description = description;
        this._pathToFile = pathToFile;
        this._userName = userName;
        this._password = password;
        this._apiKey = apiKey;
    }

    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set name(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set keyWord(keyWord) {
        this._keyWord = keyWord;
    }

    get keyWord() {
        return this._keyWord;
    }

    set active(active) {
        this._active = active;
    }

    get active() {
        return this._active;
    }

    set groupKeyWord(groupKeyWord) {
        this._groupKeyWord = groupKeyWord;
    }

    get groupKeyWord() {
        return this._groupKeyWord;
    }

    set description(description) {
        this._description = description;
    }

    get description() {
        return this._description;
    }

    set pathToFile(pathToFile) {
        this._pathToFile = pathToFile;
    }

    get pathToFile() {
        return this._pathToFile;
    }

    set userName(userName) {
        this._userName = userName;
    }

    get userName() {
        return this._userName;
    }

    set password(password) {
        this._password = password;
    }

    get password() {
        return this._password;
    }

    set apiKey(apiKey) {
        this._apiKey = apiKey;
    }

    get apiKey() {
        return this._apiKey;
    }

};