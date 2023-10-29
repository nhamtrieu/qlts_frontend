const QLTSEnum = {
    Dialog: {
        Add: "add",
        Edit: "edit",
        Delete: "delete",
        Error: "error",
        Duplicate: "duplicate",
    },
    Form: {
        Add: "post",
        Edit: "put",
        AddLabel: "Thêm tài sản",
        EditLabel: "Sửa tài sản",
        Duplicate: "Nhân bản tài sản",
    },
    ToastMsg: {
        Success: "success",
        Error: "error",
        Infor: "infor",
    },
    AssetCategory: {
        CodeIndex: 0,
        NameIndex: 1,
        IdIndex: 2,
        DepreciationRateIndex: 3,
        LifeTimeIndex: 4,
    },
    Department: {
        CodeIndex: 0,
        NameIndex: 1,
        IdIndex: 2,
    },
    Source: {
        Central: 1, // trung ương
        Provincial: 2, // tỉnh
        District: 3, // huyện
        Commune: 4, // xã
    },
    CodeType: {
        Asset: 1, // tài sản
        Increase: 2, // chứng từ
    },
    ContextMenuType: {
        Asset: 1, /// tài sản
        Increase: 2, // chứng từ
    },
};

export default QLTSEnum;
