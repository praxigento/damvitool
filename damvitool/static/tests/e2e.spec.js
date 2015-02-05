/*global describe, beforeEach, it, expect, angular, browser, element, by, isc, window*/

describe('e2e tests', function () {
    'use strict';

    browser.get('index.html');

    //browser.debugger();
    //browser.pause();

    it('should go to Help view when click on Help menu', function () {
        expect(browser.getLocationAbsUrl()).toMatch("/");
        element(by.scLocator("//autoID[Class=HLayout||index=5||length=8||classIndex=0||classLength=1]/member[Class=VStack||index=0||length=2||classIndex=0||classLength=1]/member[Class=Button||index=2||length=4||classIndex=2||classLength=4||roleIndex=2||roleLength=4||title=Help||scRole=button]/")).click();
        expect(browser.getLocationAbsUrl()).toMatch("/help");
    });

    it('shold show Login dialog when go to Wizard view', function () {
        element(by.scLocator('//autoID[Class=HLayout||index=5||length=8||classIndex=0||classLength=1]/member[Class=VStack||index=0||length=2||classIndex=0||classLength=1]/member[Class=Button||index=1||length=4||classIndex=1||classLength=4||roleIndex=1||roleLength=4||title=Wizard||scRole=button]/')).click();
        //browser.pause();
        expect(element(by.scLocator('//autoID[Class=LoginDialog||index=12||length=14||classIndex=0||classLength=1||roleIndex=0||roleLength=1||title=Please%20log%20in||scRole=dialog]/headerLabel/')).getText()).toMatch('Please log in');
    });
});
