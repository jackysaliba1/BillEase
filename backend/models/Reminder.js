module.exports= (sequelize,DataTypes) =>{
    const Reminder =sequelize.define("Reminder", {
        id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
        },
    billId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    reminderDate:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    reminderType:{
        type:DataTypes.ENUM("email","in-app"),
        defaultValue:"email",
    },
    isSent:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
},
{timestamps:true} );
tableName:"Reminders"

Reminder.associate=(db) =>{
    Reminder.belongsTo(db.Bills,{foreignKey:"billId"});
    Reminder.belongsTo(db.User,{foreignKey:"userId"});
};
return Reminder;
};
