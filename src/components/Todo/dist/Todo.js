"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var Add_1 = require("@material-ui/icons/Add");
var ExpandMore_1 = require("@material-ui/icons/ExpandMore");
var core_1 = require("@material-ui/core");
//@ts-ignore
var react_uuid_1 = require("react-uuid");
var Close_1 = require("@material-ui/icons/Close");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var useStyles = core_1.makeStyles({
    root: {
        display: "flex",
        width: "100%"
    },
    heading: {
    // fontSize: theme.typography.pxToRem(15),
    // fontWeight: theme.typography.fontWeightRegular,
    },
    underline: {
        "&&&:before": {
            borderBottom: "none"
        }
    },
    textFeild: {
        padding: "10px 0px 7px"
    },
    subtitle1: {
        textDecorationLine: "line-through",
        textDecorationStyle: "solid",
        padding: "10px 0px 7px"
    },
    accordion: {
        boxShadow: "none",
        borderTop: "1px solid black",
        marginTop: "20px"
    },
    accordionDetails: {
        display: "block",
        paddingLeft: "0px"
    },
    accordionSummary: {
        paddingLeft: "4.2%"
    },
    closeIcon: {
        margin: "10px 0px 7px",
        cursor: "pointer"
    },
    plusIcon: {
        margin: "5px 10px 0px 8px"
    }
});
var Add = function (props) {
    var classes = useStyles();
    var addItem = props.addItem;
    var _a = react_1.useState(""), itemName = _a[0], setItemName = _a[1];
    return (react_1["default"].createElement(core_1.Container, { className: classes.root },
        react_1["default"].createElement(Add_1["default"], { className: classes.plusIcon }),
        " ",
        react_1["default"].createElement(core_1.FormControl, { fullWidth: true },
            react_1["default"].createElement(core_1.TextField, { onChange: function (e) {
                    addItem({ name: e.target.value, uuid: react_uuid_1["default"](), isComplete: false });
                    setItemName("");
                }, placeholder: "Add item.", value: itemName, className: "w-10/12", autoFocus: true }))));
};
var Item = function (props) {
    var items = props.items, setItemsCallback = props.setItemsCallback, itemIndex = props.itemIndex, addItem = props.addItem;
    var inputRef = react_1.useRef(null);
    var classes = useStyles();
    var _a = react_1.useState(""), itemText = _a[0], setItemText = _a[1];
    react_1.useEffect(function () {
        // @ts-ignore
        items[itemIndex].name.length < 2 &&
            inputRef.current &&
            inputRef.current.focus();
        setItemText(items[itemIndex].name);
    }, []);
    if (items[itemIndex].isComplete)
        return null;
    var handleReorder = function () { };
    return (react_1["default"].createElement(core_1.Container, { className: classes.root },
        react_1["default"].createElement(core_1.Checkbox, { onChange: function (e) {
                items[itemIndex].isComplete = true;
                setItemsCallback(__spreadArrays(items));
            } }),
        react_1["default"].createElement(core_1.FormControl, { fullWidth: true },
            react_1["default"].createElement(core_1.TextField, { className: classes.textFeild, InputProps: { classes: { underline: classes.underline } }, inputRef: inputRef, value: itemText, onChange: function (e) {
                    items[itemIndex].name = e.target.value;
                    setItemText(e.target.value);
                }, 
                // tagName='article' // Use a custom HTML tag (uses a div by default)
                onBlur: function (e) {
                    setItemsCallback(__spreadArrays(items));
                }, onKeyPress: function (e) {
                    return e.key === "Enter" &&
                        itemIndex < 1 &&
                        addItem({ name: "", uuid: react_uuid_1["default"](), isComplete: false });
                } })),
        react_1["default"].createElement(Close_1["default"], { className: classes.closeIcon, onClick: function (e) {
                items.splice(itemIndex, 1);
                setItemsCallback(__spreadArrays(items));
            } }),
        " "));
};
var TodoCompletedItem = function (props) {
    var items = props.items, setItemsCallback = props.setItemsCallback, itemIndex = props.itemIndex;
    var classes = useStyles();
    if (!items[itemIndex].isComplete)
        return null;
    return (react_1["default"].createElement(core_1.Container, { className: classes.root },
        react_1["default"].createElement(core_1.Checkbox, { checked: true, onChange: function (e) {
                items[itemIndex].isComplete = false;
                setItemsCallback(__spreadArrays(items));
            } }),
        react_1["default"].createElement(core_1.Typography, { variant: "subtitle1", className: classes.subtitle1 }, items[itemIndex].name)));
};
exports["default"] = (function (props) {
    var _a = props.defaultItems, defaultItems = _a === void 0 ? [] : _a, onChange = props.onChange;
    var _b = react_1.useState(defaultItems), items = _b[0], setItems = _b[1];
    var classes = useStyles();
    var setItemsCallback = function (updatedItems) {
        setItems(updatedItems);
        onChange(updatedItems);
    };
    var addItem = function (item) {
        items.unshift(item);
        setItemsCallback(__spreadArrays(items));
    };
    var completedItemsLength = items.filter(function (item) { return item.isComplete; }).length;
    return (react_1["default"].createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: function (param) {
            var _a;
            console.log("DROP END");
            var srcI = param.source.index;
            var desI = (_a = param.destination) === null || _a === void 0 ? void 0 : _a.index;
            if (desI) {
                items.splice(desI, 0, items.splice(srcI, 1)[0]);
                setItems(items);
            }
        } },
        react_1["default"].createElement(react_beautiful_dnd_1.Droppable, { droppableId: "droppable-1" }, function (provided, _) { return (react_1["default"].createElement(core_1.Container, __assign({ ref: provided.innerRef }, provided.droppableProps),
            react_1["default"].createElement(Add, { addItem: addItem }),
            items.map(function (item, index) {
                return (react_1["default"].createElement(react_beautiful_dnd_1.Draggable, { key: item.uuid, draggableId: "draggable-" + item.uuid, index: index }, function (provided, _) { return (react_1["default"].createElement("div", __assign({ ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps),
                    react_1["default"].createElement(Item, { items: items, addItem: addItem, key: item.uuid, itemIndex: index, setItemsCallback: setItemsCallback }))); }));
            }),
            completedItemsLength > 0 && (react_1["default"].createElement(core_1.Accordion, { className: classes.accordion, defaultExpanded: true },
                react_1["default"].createElement(core_1.AccordionSummary, { className: classes.accordionSummary, expandIcon: react_1["default"].createElement(ExpandMore_1["default"], null), "aria-controls": "panel1a-content", id: "panel1a-header" },
                    react_1["default"].createElement(core_1.Typography, null,
                        " ",
                        completedItemsLength,
                        " Completed items",
                        " ")),
                react_1["default"].createElement(core_1.AccordionDetails, { className: classes.accordionDetails }, items.map(function (item, index) {
                    console.log("in todocompleted item loop");
                    return (react_1["default"].createElement(react_beautiful_dnd_1.Draggable, { key: item.uuid, draggableId: "draggable-" + index, index: index }, function (provided, _) { return (react_1["default"].createElement("div", __assign({ ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps),
                        react_1["default"].createElement(TodoCompletedItem, { items: items, key: item.uuid, itemIndex: index, setItemsCallback: setItemsCallback }))); }));
                })))),
            provided.placeholder)); })));
});
