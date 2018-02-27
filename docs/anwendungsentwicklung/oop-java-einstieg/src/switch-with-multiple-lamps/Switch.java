import java.util.*;

/**
 * A simple switch with the states ON and OFF.
 *
 * @author André Bauer
 * @version 1.0
 */
public class Switch {
  /**
   * The current state of the switch.
   */
  private State state;

  /**
   * The list of connected lamps.
   */
  private List<Lamp> lamps;

  /**
   * Creates a new switch witch has an initial state OFF
   * and an empty list of connected lamps.
   */
  public Switch() {
    state = State.OFF;
    lamps = new ArrayList<Lamp>();
  }      

  /**
   * Turns the state of the switch and
   * signals every connected lamp to turn 
   * its state to the state of the switch.
   */
  public void press() {
    for (Lamp lamp: lamps) {
      switch (state) {
        case OFF:
          lamp.turnOn();
          break;
        
        case ON:
          lamp.turnOff();
        }
     }
  }

  /**
   * Connects a lamp with the switch.
   *
   * @param lamp The lamp, which should become connected with the switch.
   */
  public void connect(Lamp lamp) {
    lamps.add(lamp);
  }

  /**
   * Disconnects a lamp from the switch, if connected
   *
   * @param lamp The lamp, which should become disconnected from the switch.
   */   
  public void disconnect(Lamp lamp) {
    lamps.remove(lamp);
  }      
}
