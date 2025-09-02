/*
 * This file is part of the OpenTTD Coopetition Game Script
 * The script manages competitive cooperative gameplay in OpenTTD
 */

class Coopetition extends GSInfo {
    function GetAuthor()      { return "Bahulneel"; }
    function GetName()        { return "Coopetition"; }
    function GetDescription() { return "A Game Script that manages competitive cooperative gameplay, tracking both shared and personal goals."; }
    function GetVersion()     { return 1; }
    function GetDate()        { return "2023-06-01"; }
    function CreateInstance() { return "Coopetition"; }
    function GetShortName()   { return "COOP"; }
    function GetAPIVersion()  { return "1.2"; }
    function GetURL()         { return "https://github.com/bahulneel/openttd-coopetition"; }
    
    function GetSettings() {
        AddSetting({
            name = "log_level", 
            description = "Debug log level", 
            easy_value = 1, 
            medium_value = 1, 
            hard_value = 1, 
            custom_value = 1, 
            flags = CONFIG_INGAME, 
            min_value = 0, 
            max_value = 3
        });
        
        AddSetting({
            name = "shared_goal_reward", 
            description = "Cash reward for completing shared goals", 
            easy_value = 100000, 
            medium_value = 50000, 
            hard_value = 25000, 
            custom_value = 50000, 
            flags = CONFIG_INGAME, 
            min_value = 0, 
            max_value = 1000000,
            step_size = 10000
        });
    }
}

/* Register the class to make it available to the game */
RegisterGS(Coopetition());