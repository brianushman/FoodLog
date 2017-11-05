using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FoodLog.Models
{
    public class LogEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid LogEntryId { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
        [Required]
        public MealType Meal { get; set; }
        public string Description { get; set; }
        public int HungerScale { get; set; }
        public string Location { get; set; }
        public string Comments { get; set; }
        public string Image { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }

    public enum MealType
    {
        Breakfast = 1,
        Lunch,
        Dinner,
        Snack,
        Elimination,
        Awake,
        Asleep
    }
}