import winston from "winston";

const enumarateErrorFormat = winston.format((info) => {
    if(info instanceof Error){
        Object.assign(info , {message : info.stack});

    }
    return info;
});

const logger  = winston.createLogger({
    level  : process.env.NODE_ENV === "developmet" ? "debug" : "info",
    format : winston.format.combine(enumarateErrorFormat() ,
    process.env.NODE_ENV === "development" ? 
    winston.format.colorize() : winston.format.uncolorize() , winston.format.splat(),
    winston.format.printf(({level , message})=> `${level} : ${message}`)),
    transports : [
        new winston.transports.Console({
            stderrLevels : ["error"],
        })
    ]


})


export default logger;