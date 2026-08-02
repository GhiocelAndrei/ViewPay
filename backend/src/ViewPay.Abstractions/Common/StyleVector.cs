namespace ViewPay.Abstractions.Common;

/// <summary>8 scored style dimensions, 0–100 each (dev-doc §6). TODO: similarity logic later.</summary>
public class StyleVector
{
    public int Warmth { get; set; }
    public int Energy { get; set; }
    public int Authority { get; set; }
    public int Refinement { get; set; }
    public int Convention { get; set; }
    public int Humor { get; set; }
    public int Demonstration { get; set; }
    public int Intimacy { get; set; }
}
