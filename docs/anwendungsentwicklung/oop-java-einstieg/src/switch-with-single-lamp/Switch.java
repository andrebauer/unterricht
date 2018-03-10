public class Switch {
  private State state;
  private Lamp lamp; // <2>
    
  public Switch() {
    state = State.OFF;
  }      
    
  public void press() {
    if (lamp != null) { // <3>
      switch (state) {
        case OFF:
	  this.state = State.ON;
          lamp.turnOn();
          break;
        
       case ON:
	 this.state = State.OFF;  
         lamp.turnOff();
       }
    }
  }
    
  public void connect(Lamp lampToConnect) { // <4>
    if (lamp == null) { // <5>
      lamp = lampToConnect;
    }
  }
    
  public void disconnect(Lamp lampToDisconnect) { // <6>
    if (lamp == lampToDisconnect) { // <7>
      lamp = null;
    } 
  }      
}
