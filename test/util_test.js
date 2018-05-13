const assert = require("assert");
const util = require("../lib/util");
const fs = require("fs");
const ObjectID = require("mongodb").ObjectID;

var testTransform = function(text) {
    return "Transformed";
};

var imagesArr = [];

describe("util", function() {
    before(function() {
        const imageInfoArr = [
            {
                fileName: "Black_tea_pot_cropped.jpg",
                mimeType: "image/jpeg",
                id: "test"
            },
            {
                fileName: "Ingranaggio.png",
                mimeType: "image/png",
                id: "test2"
            },
            {
                fileName: "1525676723.png",
                mimeType: "image/png",
                id: "test3"
            }
        ];
        imageInfoArr.forEach(function(item) {
            var imageFile = fs.readFileSync("./test/assets/" + item.fileName + "");
            var expectedImageFileBase64 = fs.readFileSync("./test/assets/" + item.fileName + ".txt").toString();
            imagesArr.push(Object.assign({
                imageBuffer: imageFile,
                imageBase64: expectedImageFileBase64
            }, item));
        });
    });

    describe("internal functions", function() {
        describe("encodeHTML", function () {
            it("should encode '<', '>', and '&' characters", function () {
                assert.strictEqual(util.encodeHTML("<>&"), "&lt;&gt;&amp;");
            });
            it("should encode single quote and double quote characters", function () {
                assert.strictEqual(util.encodeHTML("'\""), "&#39;&quot;");
            });
            it("should return undefined if undefined is passed in as the string", function () {
                assert.strictEqual(util.encodeHTML(undefined), undefined);
            });
        });

        describe("runTextTransformation", function () {
            it("should run a transformation function on given text", function() {
                var funcArr = [testTransform];
                assert.strictEqual(util.runTextTransformation(funcArr, "Test"), "Transformed");
            });
            it("should return the input text if empty function array passed", function () {
                assert.strictEqual(util.runTextTransformation([], "Test"), "Test");
            });
            it("should return undefined if undefined is passed in as function array", function () {
                assert.strictEqual(util.runTextTransformation(undefined, "Test"), undefined);
            });
        });
    });

    describe("external functions", function() {
        describe("extToMimeType", function() {
            it("should return a MIME type string given an extension string", function() {
                assert.strictEqual(util.extToMimeType("png"), "image/png");
            });
            it("should return undefined if undefined passed", function() {
                assert.strictEqual(util.extToMimeType(undefined), undefined);
            });
        });
        describe("mimeTypeToExt", function () {
            it("should return an extension string given a MIME type string", function() {
                assert.strictEqual(util.mimeTypeToExt("image/png"), "png");
            });
            it("should return undefined if undefined passed", function () {
                assert.strictEqual(util.mimeTypeToExt(undefined), undefined);
            });
        });
        describe("isValidImageType", function () {
            it("should return true for a valid image type supported by simpleimage", function() {
                assert.strictEqual(util.isValidImageType("image/png"), true);
            });
            it("should return false if an invalid image type is passed", function() {
                assert.strictEqual(util.isValidImageType("application/json"), false);
            });
            it("should return false if undefined is passed", function() {
                assert.strictEqual(util.isValidImageType(undefined), false);
            });
        });
        describe("getValidImageTypes", function () {
            it("should return the image types supported by simpleimage", function() {
                var results = util.getValidImageTypes();
                assert.equal(results.indexOf("png") >= 0, true);
                assert.equal(results.indexOf("jpg") >= 0, true);
                assert.equal(results.indexOf("jpeg") >= 0, true);
                assert.equal(results.indexOf("gif") >= 0, true);
                assert.equal(results.indexOf("bmp") >= 0, true);
            });
        });
        describe("getValidImageTypesString", function () {
            it("should return a string form of the images supported by simpleimage", function() {
                var supportedTypes = ["png", "jpg", "jpeg", "gif", "bmp"];
                var str = util.getValidImageTypesString();
                var strArr = str.split(/, */);
                assert.equal(strArr.length === supportedTypes.length, true);
                var filteredArr = strArr.filter(function(value) {
                    return (supportedTypes.indexOf(value) === -1);
                });
                assert.equal(filteredArr.length === 0, true);
            });
        });
        describe("createJSONResponseObject", function () {
            it("should create an object containing passed in status and message", function() {
                var status = "success";
                var message = "This was a success.";
                var obj = util.createJSONResponseObject(status, message);
                assert.deepStrictEqual(obj, {
                    status,
                    message
                });
            });
            it("should have a status of 'error' if undefined passed as status", function() {
                var obj = util.createJSONResponseObject(undefined, "My message here");
                assert.strictEqual(obj.status, "error");
            });
            it("should not contain a message property if undefined passed as message", function() {
                var obj = util.createJSONResponseObject("success", undefined);
                assert.strictEqual(obj.message, undefined);
            });
        });
        describe("sanitizeText", function () {
            it("should sanitize input text", function() {
                assert.fail("Not implemented");
            });
            it("should return empty string if empty string passed in", function() {
                assert.fail("Not implemented");
            });
            it("should return undefined if undefined passed in", function() {
                assert.fail("Not implemented");
            });
        });
        describe("escapeOutput", function () {
            it("should escape output text", function () {
                assert.fail("Not implemented");
            });
            it("should return empty string if empty string passed in", function () {
                assert.fail("Not implemented");
            });
            it("should return undefined if undefined passed in", function () {
                assert.fail("Not implemented");
            });
        });
        describe("getRedirectPath", function () {
            it("should return a relative path string given a production url", function() {
                var myURL = "https://www.simpleimage.com/images/test";
                assert.strictEqual(util.getRedirectPath(myURL), "/images/test");
            });
            it("should return root path string given 'home' string as url", function() {
                assert.strictEqual(util.getRedirectPath("home"), "/");
            });
            it("should return root path string given undefined as url", function () {
                assert.strictEqual(util.getRedirectPath(undefined), "/");
            });
        });
        describe("convertImageBinaryToBase64", function () {
            it("should convert binary image data to base64 equivalent", function() {
                var image = imagesArr[0];
                var imageFile = image.imageBuffer;
                var expectedImageFileBase64 = image.imageBase64;

                var actualImageFileBase64 = util.convertImageBinaryToBase64(imageFile);

                assert.equal(actualImageFileBase64, expectedImageFileBase64, "The base64 strings don't match.");
            });
            it("should return undefined if undefined is passed as binary image data", function() {
                var imageBase64 = util.convertImageBinaryToBase64(undefined);

                assert.equal(imageBase64, undefined);
            });
            it("should return undefined if null is passed as binary image data", function () {
                var imageBase64 = util.convertImageBinaryToBase64(null);

                assert.equal(imageBase64, undefined);
            });
            it("should return undefined if malformed binary image data is passed in", function() {
                var imageBase64 = util.convertImageBinaryToBase64(new Buffer("corrupted data"));

                assert.equal(imageBase64, undefined);
            });
        });
        describe("constructBase64ImageArray", function() {
            it("should construct a set of base64 images (data + info) given array of image info from DB", function() {
                var dbImages = imagesArr.map(function(item, index) {
                    return {
                        data: item.imageBuffer,
                        mimetype: item.mimeType,
                        id: item.id,
                        encoding: "7bit",
                        uploadeddate: new Date(0),
                        _id: new ObjectID(index.toString().padStart(24, "a"))
                    }
                });

                var base64Images = util.constructBase64ImageArray(dbImages);
                
                assert.equal(base64Images.length, dbImages.length);
                for (var i = 0; i < base64Images.length; i++) {
                    assert.equal(base64Images[i].data, imagesArr[i].imageBase64);
                    assert.equal(base64Images[i].mimeType, imagesArr[i].mimeType);
                    assert.equal(base64Images[i].id, imagesArr[i].id);
                }
            });
            it("should return undefined if undefined is passed as array of image info", function () {
                var base64Images = util.constructBase64ImageArray(undefined);

                assert.equal(base64Images, undefined);
            });
            it("should return undefined if null is passed as array of image info", function () {
                var base64Images = util.constructBase64ImageArray(null);

                assert.equal(base64Images, undefined);
            });
            it("should return undefined if malformed image data was encountered in the array of image info passed in", function() {
                var dbImages = imagesArr.slice(0,1).map(function (item, index) {
                    return {
                        data: item.imageBuffer,
                        mimetype: item.mimeType,
                        id: item.id,
                        encoding: "7bit",
                        uploadeddate: new Date(0),
                        _id: new ObjectID(index.toString().padStart(24, "a"))
                    }
                });
                dbImages.push({
                    data: new Buffer("corrupted data"),
                    mimetype: "image/png",
                    id: "fail_test",
                    encoding: "7bit",
                    uploadeddate: new Date(0),
                    _id: new ObjectID("b".padStart(24, "a"))
                });

                var base64Images = util.constructBase64ImageArray(dbImages);
                
                assert.equal(base64Images, undefined);
            });
            it("should return an array of 0 images if an array of 0 image infos is passed in", function() {
                var base64Images = util.constructBase64ImageArray([]);

                assert.ok(base64Images);
                assert.equal(base64Images.length, 0);
            });
        });
    });
});
