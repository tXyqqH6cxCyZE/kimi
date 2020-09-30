import { Table } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import 'antd/lib/table/style/css';

let  _interopRequireDefault = obj =>  obj && obj.__esModule ? obj : { default: obj }
let _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
let _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
let _react2 = _interopRequireDefault(React);
let _table2 = _interopRequireDefault(Table);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

let RcTable = function (_Component) {
    _inherits(RcTable, _Component);

    function RcTable(props) {
        _classCallCheck(this, RcTable);

        var _this = _possibleConstructorReturn(this, (RcTable.__proto__ || Object.getPrototypeOf(RcTable)).call(this, props));

        _this.onTableSelectChange = function (selectedRowKeys, selectedRows) {
            _this.props.setState({
                selectedRows: selectedRows,
                selectedRowKeys: selectedRowKeys
            });
        };

        _this.handleRowClick = function (record) {
            if (_this.props.rowSelection == 'checkbox') {
                var selectedRowKeys = _this.props.sta.selectedRowKeys;
                var selectedRows = _this.props.sta.selectedRows;
                var index = selectedRowKeys.indexOf(record[_this.props.rowKey]);
                if (index != -1) {
                    selectedRowKeys.splice(index, 1);
                    selectedRows.splice(index, 1);
                    _this.props.setState({
                        selectedRowKeys: selectedRowKeys,
                        selectedRows: selectedRows
                    });
                } else {
                    selectedRowKeys.push(record[_this.props.rowKey]);
                    selectedRows.push(record);
                    _this.props.setState({
                        selectedRows: selectedRows,
                        selectedRowKeys: selectedRowKeys
                    });
                }
            } else {
                _this.props.setState({
                    selectedRows: [record],
                    selectedRowKeys: [record[_this.props.rowKey]]
                });
            }
        };

        _this.state = {
            footer: _this.props.footer,
            pagination: _this.props.pagination,
            size: _this.props.size,
            scroll: { x: _this.props.scrollWidthX, y: _this.props.scrollHeightY },
            dataSource: []
        };
        return _this;
    }

    _createClass(RcTable, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.dataSource != nextProps.dataSource) {
                var column = this.props.columns;
                var nextData = JSON.stringify(nextProps.dataSource);
                var dataSource = void 0;
                if (column) dataSource = this.forColumn(column, nextData);
                this.setState({ dataSource: dataSource });
            }
        }
    }, {
        key: 'forColumn',
        value: function forColumn(column, nextData) {
            var _this2 = this;

            var data = JSON.parse(nextData);
            column.map(function (item) {
                if (item["styMoney"]) {
                    var a = item.dataIndex;
                    data.map(function (d) {
                        var styMoney = item["styMoney"];
                        if (styMoney == "yuan") {
                            d[a] = _this2.formatMoney(d[a]);
                        } else if (styMoney == "millionYuan") {
                            d[a] = _this2.formatMoney(d[a], 6);
                        }
                    });
                }
            });
            return data;
        }
    }, {
        key: 'formatMoney',
        value: function formatMoney(s) {
            var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "2";

            var reg = /^(-?\d+)(\.\d+)?$/;
            if (reg.test(s)) {
                n = n > 0 && n <= 20 ? n : 2;
                s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
                var t = "",
                    f = "";
                if (s.substring(0, 1) == "-") {
                    s = s.substring(1);
                    f = "-";
                }
                var l = s.split(".")[0].split("").reverse(),
                    r = s.split(".")[1];
                for (var i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
                }
                return f + t.split("").reverse().join("") + "." + r;
            }
            return 0;
        }
    }, {
        key: 'render',
        value: function render() {
            var rowSelection = this.props.rowSelection ? Object.assign({}, {
                type: this.props.rowSelection,
                selectedRowKeys: this.props.sta.selectedRowKeys,
                onChange: this.onTableSelectChange,
                onSelect: this.props.onSelect,
                onSelectAll: this.props.onSelectAll
            }, this.props.rowSelection) : undefined;
            return _react2.default.createElement(
                'div',
                { className: 'db-table-list' },
                _react2.default.createElement(_table2.default, _extends({ rowSelection: rowSelection, columns: this.props.columns
                }, this.state, {
                    locale: this.props.locale,
                    onRowClick: this.props.rowSelection && this.props.onRowClick ? this.handleRowClick : undefined,
                    rowKey: this.props.rowKey,
                    bordered: this.props.bordered
                }))
            );
        }
    }]);

    return RcTable;
}(React.Component);

export default RcTable;

RcTable.propTypes = {
    rowKey: PropTypes.string,
    sta: PropTypes.object,
    dataSource: PropTypes.array.isRequired,
    rowSelection: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    scrollWidthX: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    scrollHeightY: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    footer: PropTypes.func,
    pagination: PropTypes.bool,
    size: PropTypes.oneOf(['default', 'small', 'middle']),
    onSelect: PropTypes.func,
    onSelectAll: PropTypes.func,
    onRowClick: PropTypes.bool
};

RcTable.defaultProps = {
    rowKey: "id",
    sta: {},
    dataSource: [],
    rowSelectionType: 'checkbox',
    scrollHeightY: false,
    scrollWidthX: false,
    footer: undefined,
    pagination: false,
    size: 'default',
    onRowClick: true
};