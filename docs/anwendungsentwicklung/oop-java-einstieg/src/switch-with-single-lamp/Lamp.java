public class Lamp {
  private State state;
    
  public void Lamp() {
    state = State.OFF;
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
