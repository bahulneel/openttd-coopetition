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
    function GetAPIVersion()  { return "1.11"; }
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

        // UI visibility settings
        AddSetting({
            name = "ui_show_windows",
            description = "Show periodic goal windows (shared and personal)",
            easy_value = 1,
            medium_value = 1,
            hard_value = 1,
            custom_value = 1,
            flags = CONFIG_INGAME,
            min_value = 0,
            max_value = 1
        });

        AddSetting({
            name = "ui_window_update_days",
            description = "Days between goal window updates",
            easy_value = 7,
            medium_value = 7,
            hard_value = 14,
            custom_value = 7,
            flags = CONFIG_INGAME,
            min_value = 1,
            max_value = 56,
            step_size = 1
        });

        AddSetting({
            name = "ui_use_storybook",
            description = "Use StoryBook for persistent Goals page (if available)",
            easy_value = 1,
            medium_value = 1,
            hard_value = 1,
            custom_value = 1,
            flags = CONFIG_INGAME,
            min_value = 0,
            max_value = 1
        });

        AddSetting({
            name = "ui_show_goals_now",
            description = "Show Goals windows now (toggle to trigger)",
            easy_value = 0,
            medium_value = 0,
            hard_value = 0,
            custom_value = 0,
            flags = CONFIG_INGAME,
            min_value = 0,
            max_value = 1
        });

        // Goals window publication (GSGoal)
        AddSetting({
            name = "ui_use_goals_window",
            description = "Publish active goals to the built-in Goals window",
            easy_value = 1,
            medium_value = 1,
            hard_value = 1,
            custom_value = 1,
            flags = CONFIG_INGAME,
            min_value = 0,
            max_value = 1
        });

        // Map signs for shared goals
        AddSetting({
            name = "ui_use_signs",
            description = "Place map signs for shared goal locations (if applicable)",
            easy_value = 1,
            medium_value = 1,
            hard_value = 1,
            custom_value = 1,
            flags = CONFIG_INGAME,
            min_value = 0,
            max_value = 1
        });

        // Reminder cadence (news nudges)
        AddSetting({
            name = "ui_reminders_enabled",
            description = "Send periodic reminder news about current goals",
            easy_value = 1,
            medium_value = 1,
            hard_value = 1,
            custom_value = 1,
            flags = CONFIG_INGAME,
            min_value = 0,
            max_value = 1
        });

        AddSetting({
            name = "ui_reminder_days",
            description = "Days between reminder news per company",
            easy_value = 14,
            medium_value = 14,
            hard_value = 28,
            custom_value = 14,
            flags = CONFIG_INGAME,
            min_value = 1,
            max_value = 112,
            step_size = 1
        });
    }
}

/* Register the class to make it available to the game */
RegisterGS(Coopetition());