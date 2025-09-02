/*
 * This file is part of the OpenTTD Coopetition Game Script
 * The script manages competitive cooperative gameplay in OpenTTD
 */

/*
 * Dashboard class
 * Handles UI elements for displaying progress to players
 */
class Dashboard {
    shared_goal_window = null;
    player_goal_window = null;
    leaderboard = null;
    story_shared_page_id = null;
    story_personal_page_ids = null;
    gsgoal_shared_ids = null;
    gsgoal_personal_ids = null;
    sign_ids = null;
    
    constructor() {
        this.leaderboard = {};
        this.story_personal_page_ids = {};
        this.gsgoal_shared_ids = [];
        this.gsgoal_personal_ids = {};
        this.sign_ids = [];
        this.InitializeWindows();
    }
    
    /*
     * Initialize UI windows
     */
    function InitializeWindows() {
        // No-op: UI windows are not used; we rely on GSNews for notifications
    }
    
    /*
     * Update dashboard with current goal progress
     */
    function Update(shared_goals, player_goals) {
        this.UpdateSharedGoalWindow(shared_goals);
        this.UpdatePlayerGoalWindow(player_goals);
        this.UpdateLeaderboard(shared_goals, player_goals);
    }
    
    /*
     * Update shared goal window
     */
    function UpdateSharedGoalWindow(shared_goals) {
        // Deprecated by RenderSharedGoalsWindow, intentionally left as no-op to avoid per-tick redraws
    }
    
    /*
     * Update player goal window
     */
    function UpdatePlayerGoalWindow(player_goals) {
        // Deprecated by RenderPlayerGoalsWindows, intentionally left as no-op to avoid per-tick redraws
    }
    
    /*
     * Update leaderboard data
     */
    function UpdateLeaderboard(shared_goals, player_goals) {
        // Reset leaderboard
        this.leaderboard = {};
        
        // Initialize leaderboard for all companies
        // Note: GSCompanyList doesn't exist, so we iterate manually
        for (local company_id = 0; company_id < 16; company_id++) {
            if (GSCompany.ResolveCompanyID(company_id) != GSCompany.COMPANY_INVALID) {
                this.leaderboard[company_id] <- {
                    shared_contribution = 0,
                    personal_completion = 0,
                    total_score = 0
                };
            }
        }
        
        // Calculate shared goal contributions
        foreach (goal in shared_goals) {
            foreach (company_id, contribution in goal.contributions) {
                if (company_id in this.leaderboard) {
                    this.leaderboard[company_id].shared_contribution += 
                        goal.GetCompanyContribution(company_id);
                }
            }
        }
        
        // Calculate personal goal completion
        foreach (company_id, goals in player_goals) {
            if (company_id in this.leaderboard) {
                local completed = 0;
                local total = 0;
                
                foreach (goal in goals) {
                    total++;
                    if (goal.IsCompleted()) {
                        completed++;
                    }
                }
                
                if (total > 0) {
                    this.leaderboard[company_id].personal_completion = 
                        (completed * 100) / total;
                }
            }
        }
        
        // Calculate total score (50% shared, 50% personal)
        foreach (company_id, scores in this.leaderboard) {
            this.leaderboard[company_id].total_score = 
                (this.leaderboard[company_id].shared_contribution * 0.5) + 
                (this.leaderboard[company_id].personal_completion * 0.5);
        }
    }
    
    /*
     * Display session summary
     */
    function DisplaySessionSummary() {
        // Sort companies by total score
        local sorted_companies = [];
        foreach (company_id, scores in this.leaderboard) {
            sorted_companies.append({
                company_id = company_id,
                total_score = scores.total_score
            });
        }
        
        sorted_companies.sort(function(a, b) {
            return b.total_score - a.total_score;
        });
        // Build a concise message (top 3)
        local message = "Session Summary - Top 3:\n";
        foreach (idx, company in sorted_companies) {
            if (idx >= 3) break;
            local company_id = company.company_id;
            local company_name = GSCompany.GetName(company_id);
            local shared_score = this.leaderboard[company_id].shared_contribution;
            local personal_score = this.leaderboard[company_id].personal_completion;
            local total_score = this.leaderboard[company_id].total_score;
            message += (idx + 1) + ". " + company_name + " - Total: " + total_score + "% (Shared: " + shared_score + "%, Personal: " + personal_score + "%)\n";
        }
        GSNews.Create(GSNews.NT_GENERAL, message, GSCompany.COMPANY_INVALID, GSNews.NR_NONE, 0);
    }
    
    /*
     * Send news alert to players
     */
    function SendAlert(message, company_id = null) {
        GSNews.Create(GSNews.NT_GENERAL, message, GSCompany.COMPANY_INVALID, GSNews.NR_NONE, 0);
    }
    
    /*
     * Send conflict alert when one player dominates a shared goal
     */
    function SendConflictAlert(goal, dominant_company_id, dominance_percent) {
        local company_name = GSCompany.GetName(dominant_company_id);
        local message = company_name + " is dominating the shared goal: " + 
                       goal.description + " with " + dominance_percent + "% contribution.";
        
        // Send to all companies except the dominant one
        // Note: GSCompanyList doesn't exist, so we iterate manually
        for (local company_id = 0; company_id < 16; company_id++) {
            if (GSCompany.ResolveCompanyID(company_id) != GSCompany.COMPANY_INVALID && company_id != dominant_company_id) {
                GSNews.Create(GSNews.NT_GENERAL, message, company_id, GSNews.NR_NONE, 0);
            }
        }
    }

    /*
     * Render a concise shared goals window for all companies
     */
    function RenderSharedGoalsWindow(shared_goals) {
        // In GS API, custom windows can't be created; use StoryBook instead
        this.UpdateStoryBook(shared_goals, {}, false);
    }

    /*
     * Render personal goals windows, one per company
     */
    function RenderPlayerGoalsWindows(player_goals) {
        // In GS API, custom windows can't be created; use StoryBook instead
        this.UpdateStoryBook([], player_goals, false);
    }

    // Goals Window (GSGoal) integration removed pending API alignment

    /*
     * Map signs for shared goals
     */
    function IsSignAvailable() {
        try {
            local dummy = GSSign;
            return true;
        } catch (e) {
            return false;
        }
    }

    function ClearSigns() {
        if (!this.IsSignAvailable()) return;
        foreach (sid in this.sign_ids) {
            try { GSSign.RemoveSign(sid); } catch (e) {}
        }
        this.sign_ids.clear();
    }

    function UpdateSignsForSharedGoals(shared_goals) {
        if (!this.IsSignAvailable()) return;
        // Rebuild all signs each refresh to keep simple and avoid duplicates
        this.ClearSigns();
        foreach (goal in shared_goals) {
            // Only place signs for cargo delivery goals where towns are known
            if (goal.type == SharedGoalType.CARGO_DELIVERY && goal.source_town != null && goal.dest_town != null) {
                try {
                    local src_tile = GSTown.GetLocation(goal.source_town);
                    local dst_tile = GSTown.GetLocation(goal.dest_town);
                    local src_name = GSTown.GetName(goal.source_town);
                    local dst_name = GSTown.GetName(goal.dest_town);
                    local cargo_name = goal.cargo_type != null ? GSCargo.GetCargoLabel(goal.cargo_type) : "Cargo";
                    local s1 = GSSign.BuildSign(src_tile, "Shared Goal: Send " + cargo_name + " → " + dst_name);
                    local s2 = GSSign.BuildSign(dst_tile, "Shared Goal: Receive " + cargo_name + " ← " + src_name);
                    this.sign_ids.append(s1);
                    this.sign_ids.append(s2);
                } catch (e) {}
            }
        }
    }

    /*
     * Helper to render a simple ASCII progress bar
     */
    function RenderProgressBar(percent, width) {
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        if (width < 4) width = 4;
        local filled = (percent * width) / 100;
        local bar = "[";
        for (local i = 0; i < width; i++) {
            bar += (i < filled) ? "#" : ".";
        }
        bar += "]";
        return bar;
    }

    /*
     * StoryBook integration using native OpenTTD Game Script API
     */
    function IsStoryBookAvailable() {
        // Check if GSStoryPage is available (OpenTTD 1.4+)
        try {
            local dummy = GSStoryPage; // access to trigger name resolution
            return true;
        } catch (e) {
            return false;
        }
    }

    function UpdateStoryBook(shared_goals, player_goals, show_initial) {
        if (!this.IsStoryBookAvailable()) return;

        // Build and (re)publish shared goals page (global)
        this.CreateOrReplaceSharedStoryPage(shared_goals, show_initial);

        // Build and (re)publish per-company personal goal pages
        foreach (company_id, goals in player_goals) {
            this.CreateOrReplacePersonalStoryPage(company_id, goals, show_initial);
        }
    }

    function CreateOrReplaceSharedStoryPage(shared_goals, show_page) {
        // Remove previous
        if (this.story_shared_page_id != null) {
            try { GSStoryPage.Remove(this.story_shared_page_id); } catch (e) {}
            this.story_shared_page_id = null;
        }

        local title = "Shared Goals";
        local page_id = GSStoryPage.New(GSCompany.COMPANY_INVALID, title);
        if (!GSStoryPage.IsValidStoryPage(page_id)) return;

        local text = this.BuildSharedGoalsText(shared_goals);
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, text);

        this.story_shared_page_id = page_id;
        // Note: ShowPage doesn't exist in GS API, pages are automatically visible when created
    }

    function CreateOrReplacePersonalStoryPage(company_id, goals, show_page) {
        if (!(company_id in this.story_personal_page_ids)) {
            this.story_personal_page_ids[company_id] <- null;
        }
        local prev = this.story_personal_page_ids[company_id];
        if (prev != null) {
            try { GSStoryPage.Remove(prev); } catch (e) {}
            this.story_personal_page_ids[company_id] = null;
        }

        local company_name = GSCompany.GetName(company_id);
        local title = "Personal Goals - " + company_name;
        local page_id = GSStoryPage.New(company_id, title);
        if (!GSStoryPage.IsValidStoryPage(page_id)) return;

        local text = this.BuildPersonalGoalsText(goals);
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, text);

        this.story_personal_page_ids[company_id] = page_id;
        // Note: ShowPage doesn't exist in GS API, pages are automatically visible when created
    }

    function BuildSharedGoalsText(shared_goals) {
        local lines = "";
        if (shared_goals.len() == 0) {
            lines += "No active shared goals.\n";
            return lines;
        }
        foreach (goal in shared_goals) {
            local percent = goal.target > 0 ? (goal.current_progress * 100) / goal.target : 0;
            if (percent > 100) percent = 100;
            local bar = this.RenderProgressBar(percent, 24);
            local line = "- " + goal.description + " (" + percent + "%)\n  " + bar + "\n";
            lines += line;
        }
        return lines;
    }

    function BuildPersonalGoalsText(goals) {
        local lines = "";
        if (goals.len() == 0) {
            lines += "No active personal goals.\n";
            return lines;
        }
        foreach (goal in goals) {
            local percent = goal.target > 0 ? (goal.current_progress * 100) / goal.target : 0;
            if (percent > 100) percent = 100;
            local bar = this.RenderProgressBar(percent, 24);
            local reward = goal.reward;
            local line = "- " + goal.description + " (" + percent + "%)  Reward: £" + reward + "\n  " + bar + "\n";
            lines += line;
        }
        return lines;
    }
}