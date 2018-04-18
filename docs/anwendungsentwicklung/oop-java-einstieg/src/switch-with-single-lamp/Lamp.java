public class Lamp {
  private State state;

  private Color color;  
    
  public Lamp(Color color) {
    state = State.OFF;
    this.color = color;
  }      
    
  public void turnOn() {
    state = State.ON;
    System.out.println(this + " ON"); // <1>
  }
    
  public void turnOff() {
    state = State.OFF;
    System.out.println(this + " OFF");
  }      
}       
