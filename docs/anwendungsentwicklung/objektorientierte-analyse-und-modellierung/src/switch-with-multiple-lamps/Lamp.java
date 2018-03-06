/**
 * A lamp with the states ON and OFF. It is not dimable.
 *
 * @author André Bauer
 * @version 1.0
 */
public class Lamp {
  /**
   * The current state of the lamp.
   */
  private State state = State.OFF;

  /** 
   * Creates a new lamp, with the initial state OFF.
   */
  public void Lamp() {
    state = State.OFF;
  }      

  /**
   * Turns the state of the lamp to ON.
   */
  public void turnOn() {
    state = State.ON;
    System.out.println(this + " ON");
  }
    
  /**
   * Turns the state of the lamp to OFF.
   */
  public void turnOff() {
    state = State.OFF;
    System.out.println(this + " OFF");
  }      
}       

