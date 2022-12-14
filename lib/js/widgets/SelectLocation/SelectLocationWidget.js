'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMapboxGl = require('react-mapbox-gl');

var _reactMapboxGl2 = _interopRequireDefault(_reactMapboxGl);

var _mapboxGl = require('mapbox-gl');

var _mapboxGlGeocoder = require('@mapbox/mapbox-gl-geocoder');

var _mapboxGlGeocoder2 = _interopRequireDefault(_mapboxGlGeocoder);

var _mapboxGlLanguage = require('@mapbox/mapbox-gl-language');

var _mapboxGlLanguage2 = _interopRequireDefault(_mapboxGlLanguage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HERE_APP_ID = 'R3EtGwWQmTKG5eVeyLV8';
var HERE_APP_CODE = '8aDkNeOzfxGFkOKm9fER0A';
var MAPBOX_TOKEN = 'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw';
var GEOCODE_DEBUG = false;
var MAP_LANGUAGE = 'englishMap';

var Map = (0, _reactMapboxGl2.default)({
  accessToken: MAPBOX_TOKEN
});

var geocoderControl = new _mapboxGlGeocoder2.default({
  accessToken: MAPBOX_TOKEN,
  placeholder: 'Enter a location here',

  // bounding box restricts results to Travis County
  bbox: [-98.173053, 30.02329, -97.369564, 30.627918],
  // or texas
  // bbox: [65,25.84,-93.51,36.5],
  // or by country:
  // countries: 'us',
  limit: 5,
  trackProximity: true
});

var SelectLocationWidget = function (_Component) {
  _inherits(SelectLocationWidget, _Component);

  function SelectLocationWidget(props) {
    _classCallCheck(this, SelectLocationWidget);

    var _this = _possibleConstructorReturn(this, (SelectLocationWidget.__proto__ || Object.getPrototypeOf(SelectLocationWidget)).call(this, props));

    _this.locationUpdated = _this.locationUpdated.bind(_this);
    _this.onChange = _this.onChange.bind(_this);
    _this.onStyleLoad = _this.onStyleLoad.bind(_this);
    _this.onMoveEnd = _this.onMoveEnd.bind(_this);
    _this.onDragStart = _this.onDragStart.bind(_this);
    _this.onDragEnd = _this.onDragEnd.bind(_this);
    _this.onForwardGeocodeResult = _this.onForwardGeocodeResult.bind(_this);
    _this.onGeocoderClear = _this.onGeocoderClear.bind(_this);

    // take location data from the form if it exists, or use a default
    var location = props.value ? JSON.parse(props.value) : {
      address: 'default',
      position: {
        lng: null,
        lat: null
      }
    };

    _this.state = {
      center: [location.position.lng, location.position.lat],
      showPin: true,
      geocodeAddressString: location.address,
      formValue: props.value || ''
    };
    return _this;
  }

  _createClass(SelectLocationWidget, [{
    key: 'onForwardGeocodeResult',
    value: function onForwardGeocodeResult(geocodeResult) {
      var address = geocodeResult.result.place_name;
      this.setState({ geocodeAddressString: address });
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart() {
      this.setState({
        showPin: false
      });
    }
  }, {
    key: 'onDragEnd',
    value: function onDragEnd() {
      this.setState({
        geocodeAddressString: null,
        showPin: true
      });
    }
  }, {
    key: 'onMoveEnd',
    value: function onMoveEnd(map) {
      var center = map.getCenter();
      this.locationUpdated({ lngLat: center, addressString: this.state.geocodeAddressString });
    }

    // calls us-forms-system onChange to propogate values up to the form

  }, {
    key: 'onChange',
    value: function onChange(newFormValue) {
      this.props.onChange(newFormValue);
      this.setState({ formValue: newFormValue });
    }
  }, {
    key: 'onGeocoderClear',
    value: function onGeocoderClear() {
      this.onChange({});
    }
  }, {
    key: 'onStyleLoad',
    value: function onStyleLoad(map) {
      var language = new _mapboxGlLanguage2.default();
      if (MAP_LANGUAGE === 'spanishMap') {
        map.setStyle(language.setLanguage(map.getStyle(), 'es'));
      }

      // disable map rotation using right click + drag
      map.dragRotate.disable();
      // disable map rotation using touch rotation gesture
      map.touchZoomRotate.disableRotation();

      var zoomControl = new _mapboxGl.NavigationControl();
      map.addControl(zoomControl, 'bottom-right');
      map.addControl(geocoderControl, 'top-left');

      geocoderControl.on('result', this.onForwardGeocodeResult);

      geocoderControl.on('clear', this.onGeocoderClear);

      function updateGeocoderProximity() {
        // proximity is designed for local scale, if the user is looking at the whole world,
        // it doesn't make sense to factor in the arbitrary centre of the map
        if (map.getZoom() > 9) {
          var center = map.getCenter().wrap(); // ensures the longitude falls within -180 to 180 as the Geocoding API doesn't accept values outside this range
          geocoderControl.setProximity({
            longitude: center.lng,
            latitude: center.lat
          });
        } else {
          geocoderControl.setProximity(null);
        }
      }

      map.on('load', updateGeocoderProximity); // set proximity on map load
      map.on('moveend', updateGeocoderProximity); // and then update proximity each time the map moves

      // set initial center
      map.setCenter([-97.7460479736328, 30.266184073558826]);
      map.resize();
    }

    // prepare geocoded result to be propogated to form

  }, {
    key: 'passGeocodedResult',
    value: function passGeocodedResult(_ref) {
      var lngLat = _ref.lngLat,
          addressString = _ref.addressString;

      var location = {
        address: addressString === 'default' ? null : addressString,
        position: lngLat
      };
      var locationJSON = JSON.stringify(location);

      // update the geocoder input box with the address label
      if (addressString !== 'default') {
        this.onChange(locationJSON);
        geocoderControl.setInput(location.address);
      }
    }
  }, {
    key: 'reverseGeocode',
    value: function reverseGeocode(_ref2) {
      var _this2 = this;

      var lngLat = _ref2.lngLat;

      // some tech debt here fer sure
      // eslint-disable-next-line no-unused-vars
      var mapboxURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + lngLat.lng + '%2C' + lngLat.lat + '.json?access_token=' + MAPBOX_TOKEN;
      // eslint-disable-next-line no-unused-vars
      var hereURL = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=' + lngLat.lat + '%2C' + lngLat.lng + '%2C250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=' + HERE_APP_ID + '&app_code=' + HERE_APP_CODE;
      if (GEOCODE_DEBUG) {
        fetch(mapboxURL).then(function (response) {
          var provider = 'mapbox: ';
          if (response.status !== 200) {
            console.error('Looks like there was a problem. Status Code: ' + response.status);
            return;
          }

          response.json().then(function (data) {
            var mapboxAddress = data.features[0].place_name;
            console.info(provider + JSON.stringify(data));
            console.info(mapboxAddress);
          });
        });

        fetch(hereURL).then(function (response) {
          var provider = 'HERE: ';
          if (response.status !== 200) {
            console.error('Looks like there was a problem. Status Code: ' + response.status);
            return;
          }

          response.json().then(function (data) {
            var hereAddress = data.Response.View[0].Result[0].Location.Address.Label;
            console.info(provider + JSON.stringify(data));
            console.info(hereAddress);
          });
        });
      }
      fetch(mapboxURL).then(function (response) {
        if (response.status !== 200) {
          console.error('Looks like there was a problem. Status Code: ' + response.status);
          var address = 'Dropped Pin';
          _this2.passGeocodedResult({ lngLat: lngLat, addressString: address });
          return;
        }

        response.json().then(function (data) {
          var mapboxAddress = data.features[0].place_name;
          var address = mapboxAddress;
          _this2.passGeocodedResult({ lngLat: lngLat, addressString: address });
        });
      });
    }
  }, {
    key: 'locationUpdated',
    value: function locationUpdated(_ref3) {
      var lngLat = _ref3.lngLat,
          addressString = _ref3.addressString;

      // If we have an address string, skip calling the reverse geocoder
      if (addressString) {
        this.passGeocodedResult({ lngLat: lngLat, addressString: addressString });
        return;
      }

      this.reverseGeocode({ lngLat: lngLat });
    }
  }, {
    key: 'render',
    value: function render() {
      var pinDrop = this.state.showPin ? 'show' : 'hide';

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'map-container' },
          _react2.default.createElement(
            Map
            // eslint-disable-next-line react/style-prop-object
            ,
            { style: 'mapbox://styles/croweatx/cjow5d6cd3l7g2snrvf17wf0r',
              onStyleLoad: this.onStyleLoad,
              onDragStart: this.onDragStart,
              onDragEnd: this.onDragEnd,
              onMoveEnd: this.onMoveEnd },
            _react2.default.createElement('div', { className: 'pin ' + pinDrop }),
            _react2.default.createElement('div', { className: 'pulse' })
          )
        )
      );
    }
  }]);

  return SelectLocationWidget;
}(_react.Component);

exports.default = SelectLocationWidget;
//# sourceMappingURL=SelectLocationWidget.js.map