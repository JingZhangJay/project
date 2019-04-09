    /**
     * 清空子级以下的区划数据
     * @param {string} levelCode 本级级次代码
     * @param {*} codeRank 各级区划存放的数组对象
     */
    export let clearData = (levelCode, codeRank) => {
        switch (Number(levelCode)) {
            case 1:
                codeRank.city = codeRank.county = codeRank.township = codeRank.village = [];
                break;
            case 2:
                codeRank.county = codeRank.township = codeRank.village = [];
                break;
            case 3:
                codeRank.township = codeRank.village = [];
                break;
            case 4:
                codeRank.village = [];
                break;
            default:
                break;
        }
    }

    /**
     * 根据键值将数据放置对应的省市县区域代码中
     * @param {Object} obj 区划变更明细对照数据录入界面接口返回数据
     * @param {string} codeRank 存放变量
     */
    export let placeData = (obj, codeRank) => {
        for (var key in obj) {
            switch (key) {
                case "1":
                    codeRank.province = obj[key];
                    break;
                case "2":
                    codeRank.city = obj[key];
                    break;
                case "3":
                    codeRank.county = obj[key];
                    break;
                case "4":
                    codeRank.township = obj[key];
                    break;
                case "5":
                    codeRank.village = obj[key];
                    break;
                default:
                    break;
            }
        }
        return codeRank;
    }

    /**
     * 切分指定的区划代码
     * @param zoningCode
     * @returns {Array}
     */
    export let sliceSpecifiedCode = (zoningCode) => {
        var zoningCodeArray = [];
        for (var i = 0; i < 6; i++) {
            if (i < 3) {
                zoningCodeArray.push(zoningCode.substring(i * 2, (i + 1) * 2));
            } else {
                zoningCodeArray.push(zoningCode.substring((i - 1) * 3, i * 3));
            }
        }
        return zoningCodeArray;
    }

    /**
     * 组合指定的区划代码
     * @param {arr} arr 切分开的区划数组
     */
    export let combinSpecifiedCode = (arr) => {
        var result = "";
        arr.forEach(item => {
            result += item;
        });
        return result;
    }

    /**
     * 变更类型转化
     */
    export let changeTypeConversion = (status) => {
        status = Number(status) || "";
        switch (status) {
            case 11:
                status = "新增"
                break;
            case 21:
                status = "变更"
                break;
            case 31:
                status = "并入"
                break;
            case 41:
                status = "迁移"
                break;
            default:
                break;
        }
        return status;
    }

    /**
     *  根据行政区划代码获取相应级次代码
     * @method  getAssigningCode
     * @param   zoningCode
     * @return java.lang.String
     */
    export let getAssigningCode = (zoningCode) => {

        if (zoningCode == null || zoningCode === ("") || zoningCode.length != 15) {
            return "";
        }
        var assigningCode = "";
        if (zoningCode.substring(0, 2) === ("00")) {
            return "0";
        } else if (zoningCode.substring(2, 4) === ("00")) {
            assigningCode = "1";
        } else if (zoningCode.substring(4, 6) === ("00")) {
            assigningCode = "2";
        } else if (zoningCode.substring(6, 9) === ("000")) {
            assigningCode = "3";
        } else if (zoningCode.substring(9, 12) === ("000")) {
            assigningCode = "4";
        } else if (zoningCode.substring(12, 15) === ("000")) {
            assigningCode = "5";
        } else {
            assigningCode = "6";
        }
        return assigningCode;
    }

    var translateAssigningCodes = ["province",
        "city",
        "county",
        "township",
        "village",
        "group"
    ];

    /**
     * 根据级次代码取得区划数据
     * @param assigningCode
     * @param codeRank 各级次区划数据
     * @returns {detail...}
     */
    function getZoningsByAssCode(assigningCode, codeRank) {
        return codeRank[translateAssigningCodes[Number(assigningCode) - 1]];
    }

    /**
     *  获取子级区划
     * @param assigningCode
     * @param codeRank
     * @returns {detail}
     */
    export let getSubZoning = (assigningCode, codeRank) => {
        return getZoningsByAssCode(Number(assigningCode) + 1, codeRank);
    }

    /**
     * @description 获取该行政区划的上级行政区划
     * @method  getSuperiorZoningCode
     * @params [xzqh_dm：行政区划代码]
     * @return java.lang.String：上级行政区划代码
     */
    export let getSuperiorZoningCode = (zoningCode) => {
        if (zoningCode == null || zoningCode === "" || zoningCode.length != 15) {
            return "";
        }
        var superiorZoningCode = "";
        if (zoningCode.substring(0, 2) === ("00")) {
            return "";
        } else if (zoningCode.substring(2, 4) === ("00")) {
            superiorZoningCode = "000000000000000";
        } else if (zoningCode.substring(4, 6) === ("00")) {
            superiorZoningCode = zoningCode.substring(0, 2) + "0000000000000";
        } else if (zoningCode.substring(6, 9) === ("000")) {
            superiorZoningCode = zoningCode.substring(0, 4) + "00000000000";
        } else if (zoningCode.substring(9, 12) === ("000")) {
            superiorZoningCode = zoningCode.substring(0, 6) + "000000000";
        } else if (zoningCode.substring(12, 15) === ("000")) {
            superiorZoningCode = zoningCode.substring(0, 9) + "000000";
        } else {
            superiorZoningCode = zoningCode.substring(0, 12) + "000";
        }
        return superiorZoningCode;
    }

    /**
     * 将日期对象转化成字符串
     * @param {obj} date 日期对象
     */
    export let formatDateToStr = date => {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let str;
        m = m > 10 ? m : "0" + m;
        d = d > 10 ? d : "0" + d;
        str = `${y}${m}${d}`;
        return str;
    }

    import {
        notification
    } from "antd"

    notification.config({
        top: 180,
        duration: 3,
    });

    /**
     * 全局消息提示
     * @param {string} type 提示类型
     * @param {string} description 提示信息
     */
    export let openNotificationWithIcon = (type, description) => {
        return (function () {
            let message;
            if(type == "success"){
                message = "成功";
            }else if(type == "error"){
                message = "失败";
            }else if(type == "warning"){
                message = "警告";
            }else if(type == "info"){
                message = "消息";
            }

            notification[type]({
                message: message + '提示',
                description: description,
            });
        })();
    };

    /**
     * 时间转换
     * @param {string} str 时间
     */
    export let ownTimeFormat = (str) => {
        return (function(){
            return str.replace(/^\s+|\S+$/, '');
        })();
    }
