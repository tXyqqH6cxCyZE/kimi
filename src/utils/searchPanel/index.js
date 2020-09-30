import PropTypes from 'prop-types';
import React from 'react';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();


var _react2 = _interopRequireDefault(React);

var _col = require('antd/lib/col');

var _col2 = _interopRequireDefault(_col);

require('antd/lib/col/style/css');

var _row = require('antd/lib/row');

var _row2 = _interopRequireDefault(_row);

require('antd/lib/row/style/css');

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

require('antd/lib/icon/style/css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchPanel = function (_Component) {
    _inherits(SearchPanel, _Component);

    function SearchPanel(props) {
        _classCallCheck(this, SearchPanel);

        var _this = _possibleConstructorReturn(this, (SearchPanel.__proto__ || Object.getPrototypeOf(SearchPanel)).call(this, props));

        _this.inputGroupChild = function () {
            var cols = [];
            _this.props.children[0].forEach(function (item, i) {
                cols.push(_react2.default.createElement(
                    _col2.default,
                    { span: 24 / _this.props.colNum, key: i, style: { marginBottom: 5 } },
                    item
                ));
            });
            return cols;
        };

        _this.toggle = function () {
            var expand = _this.state.expand;
            _this.setState({
                expand: !expand
            });
        };

        _this.state = {
            expand: false
        };
        return _this;
    }

    _createClass(SearchPanel, [{
        key: 'render',
        value: function render() {
            var collapseFlag = this.props.collapse && this.props.children[0].length > this.props.colNum * this.props.rowNum;
            var shownCount = this.state.expand ? this.props.children[0].length : this.props.colNum * this.props.rowNum;
            if (!collapseFlag) {
                shownCount = this.props.children[0].length;
            }
            return _react2.default.createElement(
                'div',
                { className: 'ant-advanced-search-form' },
                _react2.default.createElement(
                    _row2.default,
                    { type: 'flex', justify: this.props.formJustify, gutter: 40 },
                    ' ',
                    this.inputGroupChild().slice(0, shownCount),
                    ' '
                ),
                _react2.default.createElement(
                    _row2.default,
                    { type: 'flex', justify: this.props.buttonJustify, style: { marginTop: 10 } },
                    _react2.default.createElement(
                        _col2.default,
                        { span: 24, style: { textAlign: this.props.buttonJustify } },
                        this.props.children[1],
                        collapseFlag ? _react2.default.createElement(
                            'a',
                            { style: { paddingLeft: 8, fontSize: 12 }, onClick: this.toggle },
                            !this.state.expand ? '更多' : '收起',
                            ' ',
                            _react2.default.createElement(_icon2.default, { type: this.state.expand ? 'up' : 'down' })
                        ) : ''
                    )
                )
            );
        }
    }]);

    return SearchPanel;
}(React.Component);

exports.default = SearchPanel;


SearchPanel.propTypes = {
    collapse: PropTypes.bool,
    colNum: PropTypes.number,
    rowNum: PropTypes.number,
    formJustify: PropTypes.string,
    buttonJustify: PropTypes.string
};

SearchPanel.defaultProps = {
    colNum: 3,
    rowNum: 2,
    collapse: true,
    formJustify: 'start',
    buttonJustify: 'center'
};