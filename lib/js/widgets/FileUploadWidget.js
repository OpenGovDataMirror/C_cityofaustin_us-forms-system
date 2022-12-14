'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFilepond = require('react-filepond');

var _filepondPluginImageExifOrientation = require('filepond-plugin-image-exif-orientation');

var _filepondPluginImageExifOrientation2 = _interopRequireDefault(_filepondPluginImageExifOrientation);

var _filepondPluginImagePreview = require('filepond-plugin-image-preview');

var _filepondPluginImagePreview2 = _interopRequireDefault(_filepondPluginImagePreview);

var _filepondPluginFileValidateSize = require('filepond-plugin-file-validate-size');

var _filepondPluginFileValidateSize2 = _interopRequireDefault(_filepondPluginFileValidateSize);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _reactFilepond.registerPlugin)(_filepondPluginImageExifOrientation2.default, _filepondPluginImagePreview2.default, _filepondPluginFileValidateSize2.default);

// Plug in process.env.FORM_API_URL as endpoint to FileUploadWidget
var FileUploadWidget = function FileUploadWidget(endpoint) {
  return function (_Component) {
    _inherits(FileUploadWidget, _Component);

    function FileUploadWidget(props) {
      _classCallCheck(this, FileUploadWidget);

      var _this = _possibleConstructorReturn(this, (FileUploadWidget.__proto__ || Object.getPrototypeOf(FileUploadWidget)).call(this, props));

      var uniqueid = _crypto2.default.createHmac('sha256', _uuid2.default.v4()).digest('hex');
      _this.state = {
        uniqueIdentifier: uniqueid,
        files: [],
        fileList: []
      };

      _this.fileList = [];

      _this.filesUpdated = _this.filesUpdated.bind(_this);
      return _this;
    }

    _createClass(FileUploadWidget, [{
      key: 'handleInit',
      value: function handleInit() {
        console.log('FilePond instance has initialised.');
      }
    }, {
      key: 'handleProcessing',
      value: function handleProcessing(fieldName, file, metadata, load, error, progress, _abort) {
        // fieldName is the name of the input field
        // file is the actual file object to send
        var formData = new FormData();

        // First, find the S3 signature data from this.state.fileList

        var fileSignature = this.getFileSignatureFromList(file);
        var fields = [];

        if (fileSignature == null) {
          console.log('The file signature for file could not be located.');
        }

        try {
          fields = Object.keys(fileSignature.fields);
        } catch (error) {
          fields = [];
          console.log('Error: ');
          console.log(error);
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            formData.append(key, fileSignature.fields[key]);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        formData.append('file', file, fileSignature.fields.key);

        var request = new XMLHttpRequest();

        request.open('POST', fileSignature.url);

        // Should call the progress method to update the progress to 100% before calling load
        // Setting computable to false switches the loading indicator to infinite mode
        request.upload.onprogress = function (e) {
          progress(e.lengthComputable, e.loaded, e.total);
        };

        // Should call the load method when done and pass the returned server file id
        // this server file id is then used later on when reverting or restoring a file
        // so your server knows which file to return without exposing that info to the client
        request.onload = function () {
          if (request.status >= 200 && request.status < 300) {
            // the load method accepts either a string (id) or an object
            load(request.responseText);
          } else {
            // Can call the error method if something is wrong, should exit after
            error('oh no');
          }
        };

        request.send(formData);

        // Should expose an abort method so the request can be cancelled
        return {
          abort: function abort() {
            // This function is entered if the user has tapped the cancel button
            request.abort();

            // Let FilePond know the request has been cancelled
            _abort();
          }
        };
      }
    }, {
      key: 'withQuery',
      value: function withQuery(url, params) {
        var query = Object.keys(params).filter(function (k) {
          return params[k] !== undefined;
        }).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
        url += (url.indexOf('?') === -1 ? '?' : '&') + query;
        return url;
      }
    }, {
      key: 'parseSignatureResponse',
      value: function parseSignatureResponse(res) {
        this.fileList.push(res);

        var value = false;

        try {
          value = this.fileList.length ? JSON.stringify(this.fileList.map(function (f) {
            return '' + f.creds.fields.key;
          })) : false;
        } catch (error) {
          console.error('parseSignatureResponse() Error: ');
          console.error(error);
          value = false;
        }

        this.props.onChange(value);

        this.setState({
          fileList: [].concat(_toConsumableArray(this.fileList))
        });
      }
    }, {
      key: 'retrieveFileSignature',
      value: function retrieveFileSignature(key, uniqueIdentifier) {
        var _this2 = this;

        var formData = new FormData();

        formData.append('key', key);
        formData.append('uniqueid', uniqueIdentifier);

        fetch(this.withQuery(endpoint + '/uploads/request-signature', {
          file: key,
          uniqueid: uniqueIdentifier.toLowerCase()
        })).then(function (res) {
          return res.json();
        }).catch(function (error) {
          return console.error('Error:', error);
        }).then(function (res) {
          _this2.parseSignatureResponse(res);
        });
      }
    }, {
      key: 'handleFileAdded',
      value: function handleFileAdded(error, file) {
        this.retrieveFileSignature(file.filename, this.state.uniqueIdentifier);
      }
    }, {
      key: 'handleRemoveFile',
      value: function handleRemoveFile(file) {
        for (var i in this.fileList) {
          var currentFile = this.fileList[i];
          if (currentFile.filename === file.filename) {
            // console.log(`Removing: ${file.filename} at index: ${i}`);
            this.fileList.splice(i, 1);
            this.setState({
              fileList: [].concat(_toConsumableArray(this.fileList))
            });
          }
        }
      }
    }, {
      key: 'getFileSignatureFromList',
      value: function getFileSignatureFromList(file) {
        var uploadedFileName = file.name || '';

        for (var i in this.fileList) {
          var currentFile = this.fileList[i];
          if (currentFile.filename === uploadedFileName) {
            // console.log(`getFileSignatureFromList() Item found at index: ${i}`);
            var creds = this.fileList[i].creds;
            return creds;
          }
        }
        // If not found, return null
        return null;
      }
    }, {
      key: 'filesUpdated',
      value: function filesUpdated(_ref) {
        var fileItems = _ref.fileItems;

        // Set current file objects to this.state
        this.setState({
          files: fileItems.map(function (fileItem) {
            return fileItem.file;
          })
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'header',
            null,
            _react2.default.createElement(
              _reactFilepond.FilePond,
              {
                ref: function ref(_ref2) {
                  return _this3.pond = _ref2;
                },
                allowMultiple: true,
                allowFileSizeValidation: true,

                labelIdle: 'Drag & drop your files or <span class="filepond--label-action"> browse </span>',

                maxFiles: 100,
                maxFileSize: '20000MB'

                /* FilePond allows a custom process to handle uploads */
                , server: {
                  process: this.handleProcessing.bind(this)
                },
                oninit: function oninit() {
                  return _this3.handleInit();
                }
                /* OnAddFile we are going to request a token for that file, and update a dictionary with the tokens */
                , onaddfile: function onaddfile(error, file) {
                  return _this3.handleFileAdded(error, file);
                }
                /* OnRemoveFile we are going to find the file in the list and splice it (remove it) */
                , onremovefile: function onremovefile(file) {
                  return _this3.handleRemoveFile(file);
                },
                onupdatefiles: function onupdatefiles(fileItems) {
                  return _this3.filesUpdated({ fileItems: fileItems });
                } },
              this.state.files.map(function (file) {
                return _react2.default.createElement(_reactFilepond.File, { key: file, src: file, origin: 'local' });
              })
            )
          )
        );
      }
    }]);

    return FileUploadWidget;
  }(_react.Component);
};

exports.default = FileUploadWidget;
//# sourceMappingURL=FileUploadWidget.js.map