/**
 * The main class which runs User-Story 1.
 *
 * @author André Bauer
 * @version 1.0
 */
public class Controller {
  public static void main(String args[]) {
    // User-Story 1
    Lamp lamp1 = new Lamp();
    Lamp lamp2 = new Lamp(); 
    Lamp lamp3 = new Lamp(); 
    Switch switch1 = new Switch(); 
    switch1.connect(lamp1);
    switch1.connect(lamp2); 
    switch1.connect(lamp3); 
    switch1.press();
  }
}
