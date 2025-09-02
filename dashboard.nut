/*
 * This file is part of the OpenTTD Coopetition Game Script
 * The script manages competitive cooperative gameplay in OpenTTD
 */

/*
 * Dashboard class
 * Handles UI elements for displaying progress to players
 */
class Dashboard {
    shared_goal_window = null;  // Window for shared goals
    player_goal_window = null;  // Window for player goals
    leaderboard = null;         // Leaderboard data
    
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
     * Update player goal window
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
            GSNews.Create(GSNews.NT_GENERAL, message, GSCompany.COMPANY_INVALID);
        } else {
            // Send to specific company
            GSNews.Create(GSNews.NT_GENERAL, message, company_id);
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
        local company_list = GSCompanyList();
        foreach (company_id, _ in company_list) {
            if (company_id != dominant_company_id) {
                GSNews.Create(GSNews.NT_GENERAL, message, company_id);
            }
        }
    }
}