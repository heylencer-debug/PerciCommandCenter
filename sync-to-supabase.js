// sync-to-supabase.js — Shared module for agents to write to Supabase
// Usage: const sync = require('./sync-to-supabase.js');

const db = require('./supabase-client.js');

module.exports = {
  /**
   * Log an agent activity entry.
   * @param {string} agent - perci | vesper | brigid | ethel
   * @param {string} action - what the agent did
   * @param {string} details - additional context
   * @param {string} project - which project this relates to
   */
  async logActivity(agent, action, details, project) {
    try {
      const result = await db.insert('agent_activity', {
        agent,
        action,
        details: details || null,
        project: project || null,
        status: 'done'
      });
      return result;
    } catch (err) {
      console.error(`[sync] logActivity failed: ${err.message}`);
      throw err;
    }
  },

  /**
   * Update a carousel day's status.
   * @param {number} day - carousel day number
   * @param {string} status - planning | copy-approved | generating | review | approved | posted
   * @param {string} notes - optional notes
   */
  async updateCarousel(day, status, notes) {
    try {
      // Find the carousel by day number
      const existing = await db.select('carousels', `day=eq.${day}`);
      const now = new Date().toISOString();

      const updateData = {
        status,
        updated_at: now
      };

      if (notes) updateData.notes = notes;
      if (status === 'copy-approved') updateData.copy_approved_at = now;
      if (status === 'generating' || status === 'review') updateData.generated_at = now;
      if (status === 'posted') updateData.posted_at = now;

      if (existing && existing.length > 0) {
        return await db.update('carousels', existing[0].id, updateData);
      } else {
        return await db.insert('carousels', {
          day,
          topic: `Day ${day}`,
          ...updateData
        });
      }
    } catch (err) {
      console.error(`[sync] updateCarousel failed: ${err.message}`);
      throw err;
    }
  },

  /**
   * Add intel feed entry (from Ethel).
   * @param {string} source - competitor name or platform
   * @param {string} type - post | product | price | trend
   * @param {string} title - intel title
   * @param {string} content - intel content
   * @param {string} url - source URL
   */
  async addIntel(source, type, title, content, url) {
    try {
      return await db.insert('intel_feed', {
        source,
        type,
        title,
        content: content || null,
        url: url || null
      });
    } catch (err) {
      console.error(`[sync] addIntel failed: ${err.message}`);
      throw err;
    }
  },

  /**
   * Add a decision to the log.
   * @param {string} title - decision title
   * @param {string} context - why this decision was made
   * @param {string} decision - what was decided
   * @param {string} project - which project
   */
  async addDecision(title, context, decision, project) {
    try {
      return await db.insert('decisions', {
        title,
        context: context || null,
        decision,
        project: project || null
      });
    } catch (err) {
      console.error(`[sync] addDecision failed: ${err.message}`);
      throw err;
    }
  }
};
