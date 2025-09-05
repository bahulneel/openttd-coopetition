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
    story_onboarding_page_id = null;
    story_shared_page_id = null;
    story_personal_page_ids = null;
    gsgoal_shared_ids = null;
    gsgoal_personal_ids = null;
    sign_ids = null;
    
    constructor() {
        this.leaderboard = {};
        this.InitializeWindows();
    }
    
    /*
     * Initialize UI windows
     */
    function InitializeWindows() {
        // Create shared goal window
        this.shared_goal_window = GSWindow.New("Shared Goals", "Progress on cooperative objectives");
        GSWindow.SetSize(this.shared_goal_window, 400, 300);
        
        // Create player goal window
        this.player_goal_window = GSWindow.New("Personal Goals", "Your individual objectives");
        GSWindow.SetSize(this.player_goal_window, 400, 300);
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
        // Clear window
        GSWindow.RemoveAllWidgets(this.shared_goal_window);
        
        // Add header
        local y = 10;
        GSWindow.AddLabel(this.shared_goal_window, 0, y, 0, "Shared Goals");
        y += 20;
        
        // Add goal information
        foreach (idx, goal in shared_goals) {
            // Goal description
            GSWindow.AddLabel(this.shared_goal_window, 10, y, 1, goal.description);
            y += 15;
            
            // Progress bar
            local progress_percent = (goal.current_progress * 100) / goal.target;
            GSWindow.AddProgressBar(this.shared_goal_window, 10, y, 2, progress_percent);
            y += 15;
            
            // Progress text
            local progress_text = goal.current_progress + " / " + goal.target + " (" + progress_percent + "%)";
            GSWindow.AddLabel(this.shared_goal_window, 10, y, 3, progress_text);
            y += 15;
            
            // Tier information if applicable
            local tier = goal.GetCurrentTier();
            if (tier != null) {
                local tier_text = "Current tier: ";
                switch (tier) {
                    case GoalTier.BRONZE: tier_text += "Bronze"; break;
                    case GoalTier.SILVER: tier_text += "Silver"; break;
                    case GoalTier.GOLD: tier_text += "Gold"; break;
                }
                GSWindow.AddLabel(this.shared_goal_window, 10, y, 4, tier_text);
                y += 15;
            }
            
            // Company contributions
            GSWindow.AddLabel(this.shared_goal_window, 10, y, 5, "Company Contributions:");
            y += 15;
            
            foreach (company_id, contribution in goal.contributions) {
                local company_name = GSCompany.GetName(company_id);
                local contribution_percent = goal.GetCompanyContribution(company_id);
                local contribution_text = company_name + ": " + contribution + " (" + contribution_percent + "%)";
                
                // Color code based on contribution
                local color = GSColor.RGB(255, 255, 255); // Default white
                if (contribution_percent >= 50) {
                    color = GSColor.RGB(0, 255, 0); // Green for good contribution
                } else if (contribution_percent >= 25) {
                    color = GSColor.RGB(255, 255, 0); // Yellow for medium contribution
                } else {
                    color = GSColor.RGB(255, 0, 0); // Red for low contribution
                }
                
                GSWindow.AddLabelColored(this.shared_goal_window, 20, y, 6 + idx, contribution_text, color);
                y += 15;
            }
            
            // Separator
            y += 10;
        }
        
        // Show window to all companies
        GSWindow.ShowWindow(this.shared_goal_window, GSCompany.COMPANY_INVALID);
    }
    
    /*

     */
    function UpdatePlayerGoalWindow(player_goals) {
        // For each company, update their personal goal window
        foreach (company_id, goals in player_goals) {
            // Clear window
            GSWindow.RemoveAllWidgets(this.player_goal_window);
            
            // Add header
            local y = 10;
            GSWindow.AddLabel(this.player_goal_window, 0, y, 0, "Personal Goals for " + GSCompany.GetName(company_id));
            y += 20;
            
            // Add goal information
            foreach (idx, goal in goals) {
                // Goal description
                GSWindow.AddLabel(this.player_goal_window, 10, y, 1, goal.description);
                y += 15;
                
                // Progress bar
                local progress_percent = goal.GetProgressPercentage();
                GSWindow.AddProgressBar(this.player_goal_window, 10, y, 2, progress_percent);
                y += 15;
                
                // Progress text
                local progress_text = goal.current_progress + " / " + goal.target + " (" + progress_percent + "%)";
                GSWindow.AddLabel(this.player_goal_window, 10, y, 3, progress_text);
                y += 15;

                // Reward information
                local reward_text = "Reward: £" + goal.reward;
                GSWindow.AddLabel(this.player_goal_window, 10, y, 4, reward_text);
                y += 15;
                
                // Completion status
                if (goal.IsCompleted()) {
                    GSWindow.AddLabelColored(this.player_goal_window, 10, y, 5, "COMPLETED", GSColor.RGB(0, 255, 0));
                } else {
                    local remaining = goal.GetRemainingProgress();
                    GSWindow.AddLabel(this.player_goal_window, 10, y, 5, "Remaining: " + remaining);
                }
                y += 20;
            }
            
            // Show window only to the specific company
            GSWindow.ShowWindow(this.player_goal_window, company_id);
        }
    }

    /*
     * Update leaderboard data
     */
    function UpdateLeaderboard(shared_goals, player_goals) {
        // Reset leaderboard
        this.leaderboard = {};

        // Initialize leaderboard for all companies
        local company_list = GSCompanyList();
        foreach (company_id, _ in company_list) {
            this.leaderboard[company_id] <- {
                shared_contribution = 0,
                personal_completion = 0,
                total_score = 0
            };
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
        // Create summary window
        local summary_window = GSWindow.New("Session Summary", "Coopetition Results");
        GSWindow.SetSize(summary_window, 500, 400);
        
        // Add header
        local y = 10;
        GSWindow.AddLabel(summary_window, 0, y, 0, "Session Summary");
        y += 20;
        
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
        
        // Display rankings
        GSWindow.AddLabel(summary_window, 10, y, 1, "Coopetition Rankings:");
        y += 20;
        
        foreach (idx, company in sorted_companies) {
            local company_id = company.company_id;
            local company_name = GSCompany.GetName(company_id);
            local shared_score = this.leaderboard[company_id].shared_contribution;
            local personal_score = this.leaderboard[company_id].personal_completion;
            local total_score = this.leaderboard[company_id].total_score;
            
            local rank_text = (idx + 1) + ". " + company_name + 
                             " - Total: " + total_score + "%" + 
                             " (Shared: " + shared_score + "%, Personal: " + personal_score + "%)";
            
            // Color code based on ranking
            local color = GSColor.RGB(255, 255, 255); // Default white
            if (idx == 0) {
                color = GSColor.RGB(255, 215, 0); // Gold for 1st place
            } else if (idx == 1) {
                color = GSColor.RGB(192, 192, 192); // Silver for 2nd place
            } else if (idx == 2) {
                color = GSColor.RGB(205, 127, 50); // Bronze for 3rd place
            }
            
            GSWindow.AddLabelColored(summary_window, 10, y, 2 + idx, rank_text, color);
            y += 15;
        }
        
        // Show window to all companies
        GSWindow.ShowWindow(summary_window, GSCompany.COMPANY_INVALID);
    }

    /*
     * Send news alert to players
     */
    function SendAlert(message, company_id = null) {
        if (company_id == null) {
            // Send to all companies
            GSNews.Create(GSNews.NT_GENERAL, message, GSCompany.COMPANY_INVALID, GSNews.NR_NONE, 0);
        } else {
            // Send to specific company
            GSNews.Create(GSNews.NT_GENERAL, message, company_id, GSNews.NR_NONE, 0);
        }
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
                    local s1 = GSSign.BuildSign(src_tile, "Shared Goal: Send " + cargo_name + " " + ARROW_RIGHT + " " + dst_name);
                    local s2 = GSSign.BuildSign(dst_tile, "Shared Goal: Receive " + cargo_name + " " + ARROW_LEFT + " " + src_name);
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

        // Build and (re)publish onboarding page (global)
        this.CreateOrReplaceOnboardingStoryPage(show_initial);

        // Build and (re)publish shared goals page (global)
        this.CreateOrReplaceSharedStoryPage(shared_goals, show_initial);

        // Build and (re)publish per-company personal goal pages
        foreach (company_id, goals in player_goals) {
            this.CreateOrReplacePersonalStoryPage(company_id, goals, show_initial);
        }
    }

    function CreateOrReplaceSharedStoryPage(shared_goals, show_page) {
        // Always recreate shared goals page since content changes dynamically
        // Remove previous if it exists
        if (this.story_shared_page_id != null) {
            try { GSStoryPage.Remove(this.story_shared_page_id); } catch (e) {}
            this.story_shared_page_id = null;
        }

        local title = "Shared Goals";
        local page_id = GSStoryPage.New(GSCompany.COMPANY_INVALID, title);
        if (!GSStoryPage.IsValidStoryPage(page_id)) return;

        this.BuildSharedGoalsElements(page_id, shared_goals);

        this.story_shared_page_id = page_id;
        // Note: ShowPage doesn't exist in GS API, pages are automatically visible when created
    }

    function CreateOrReplaceOnboardingStoryPage(show_page) {
        // Check if page already exists
        if (this.story_onboarding_page_id != null && GSStoryPage.IsValidStoryPage(this.story_onboarding_page_id)) {
            return; // Page already exists, no need to recreate
        }

        // Remove previous if it exists but is invalid
        if (this.story_onboarding_page_id != null) {
            try { GSStoryPage.Remove(this.story_onboarding_page_id); } catch (e) {}
            this.story_onboarding_page_id = null;
        }

        local title = "Welcome to Coopetition";
        local page_id = GSStoryPage.New(GSCompany.COMPANY_INVALID, title);
        if (!GSStoryPage.IsValidStoryPage(page_id)) return;

        this.BuildOnboardingElements(page_id);

        this.story_onboarding_page_id = page_id;
        // Note: ShowPage doesn't exist in GS API, pages are automatically visible when created
    }

    function CreateOrReplacePersonalStoryPage(company_id, goals, show_page) {
        if (!(company_id in this.story_personal_page_ids)) {
            this.story_personal_page_ids[company_id] <- null;
        }
        
        // Always recreate personal goals page since content changes dynamically
        local prev = this.story_personal_page_ids[company_id];
        if (prev != null) {
            try { GSStoryPage.Remove(prev); } catch (e) {}
            this.story_personal_page_ids[company_id] = null;
        }

        local company_name = GSCompany.GetName(company_id);
        local title = "Personal Goals - " + company_name;
        local page_id = GSStoryPage.New(company_id, title);
        if (!GSStoryPage.IsValidStoryPage(page_id)) return;

        this.BuildPersonalGoalsElements(page_id, goals);

        this.story_personal_page_ids[company_id] = page_id;
        // Note: ShowPage doesn't exist in GS API, pages are automatically visible when created
    }

    function BuildOnboardingElements(page_id) {
        // Title
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "=== WELCOME TO COOPETITION! ===");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "");
        
        // Description
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "A competitive cooperative gameplay experience where you work with other players to achieve shared goals while pursuing personal objectives.");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "");
        
        // Getting Started section
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "GETTING STARTED:");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " Open the Goals window to see your objectives");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " Check StoryBook pages for Shared and Personal Goals");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " Look for map signs marking shared cargo routes");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " Toggle 'Show goals now' in settings to refresh UI");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "");
        
        // How it works section
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "HOW IT WORKS:");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " Shared Goals: Work together with other companies to achieve common objectives");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " Personal Goals: Complete individual challenges for your company");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " Progress is tracked automatically as you play");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " Check back regularly to see your progress");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "");
        
        // Closing
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "Good luck and have fun!");
    }

    function BuildSharedGoalsElements(page_id, shared_goals) {
        if (shared_goals.len() == 0) {
            GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "No active shared goals.");
            return;
        }
        foreach (goal in shared_goals) {
            local percent = goal.target > 0 ? (goal.current_progress * 100) / goal.target : 0;
            if (percent > 100) percent = 100;
            local bar = this.RenderProgressBar(percent, 24);
            GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " " + goal.description + " (" + percent + "%)");
            GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "  " + bar);
        }
    }

    function BuildPersonalGoalsElements(page_id, goals) {
        if (goals.len() == 0) {
            GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "No active personal goals.");
            return;
        }
        foreach (goal in goals) {
            local percent = goal.target > 0 ? (goal.current_progress * 100) / goal.target : 0;
            if (percent > 100) percent = 100;
            local bar = this.RenderProgressBar(percent, 24);
            GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " " + goal.description + " (" + percent + "%)");
            GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "  " + bar);
        }
    }
}