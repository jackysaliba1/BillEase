module.exports=(sequelize,DataTypes) =>{
    const UserSettings=sequelize.define("UserSettings",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            unique:true,
        },
        reminderDaysBefore:{
            type:DataTypes.INTEGER,
            defaultValue:3,
            validate:{min:1, max:30},
        },
        notificationType:{
            type:DataTypes.ENUM("email","in-app","both"),
            defaultValue:"email",
        },
        emailNotifications:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
        },
        inAppNotifications:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        },
    }, {timestamps:true});
    UserSettings.associate=(db) =>{
        UserSettings.belongsTo(db.User,{foreignKey:"userId"});
    };
        
    return UserSettings;
};