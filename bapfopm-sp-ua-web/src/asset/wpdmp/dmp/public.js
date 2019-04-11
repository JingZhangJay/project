

let Group= {
    turnGroup: function (system,id) {
        let newId=parseFloat(id)
        let res=system.filter((item)=>{
            return newId===item.systemId
        })
        return res[0].systemName
    },
    turnIsUse:function (num) {
        return num=='1'?'启用':'停用'
    }
};
export {Group}