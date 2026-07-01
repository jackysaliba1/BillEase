module.exports= (sequelize,DataTypes) =>{
    const Bills=sequelize.define("Bills", {
    id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    },
    amount:{
    type:DataTypes.DOUBLE,
    allowNull:false,
    validate:{
        isFloat:true,
        min:0
      }
    },
    dueDate:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    Description:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    Status:{
        type:DataTypes.ENUM("pending","paid","overdue"),
        allowNull:false,
        defaultValue:"pending",
    },
    Category:{
        type:DataTypes.ENUM("electricity","rent","water","subscription","phone","other"),
        allowNull:false,
    },
},
    {timestamps:true,
    
});
Bills.associate=(db) =>{
    Bills.belongsTo(db.User,{foreignKey:"userId"});
   Bills.hasMany(db.Reminder,{foreignKey:"billId"});
  // Bills.hasMany(db.BillSplit,{foreignKey:"billId"});
};
return Bills;
};