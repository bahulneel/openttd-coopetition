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
    
    constructor() {
        this.leaderboard = {};
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
        // No-op: UI windows are disabled
    }
    
    /*
     * Update player goal window
     */
    function UpdatePlayerGoalWindow(player_goals) {
        // No-op: UI windows are disabled
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
        GSNews.Create(GSNews.NT_GENERAL, message, GSCompany.COMPANY_INVALID);
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