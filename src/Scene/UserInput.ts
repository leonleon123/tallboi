export class UserInput{

    public keysPressed = new Set<string>();
    public sensitivity = 10.0;
    public mouseDelta: Array<number> = [0, 0];

    constructor(){
        document.addEventListener('keydown', event => {
            this.keysPressed.add(event.code);

        });
        document.addEventListener('keyup', event => {
            this.keysPressed.delete(event.code);
        });
        document.addEventListener('mousemove', event => {
            const canvas =  document.querySelector('canvas');
            if (canvas){
                if (document.pointerLockElement === canvas) {
                    this.mouseDelta[0] = event.movementX;
                    this.mouseDelta[1] = event.movementY;
              } else {
                    this.mouseDelta[0] = 0;
                    this.mouseDelta[1] = 0;
              }
            }

        });
        document.addEventListener('click', event => {
            const canvas =  document.querySelector('canvas');
            if (canvas) {
                canvas.requestPointerLock();
            }
        });
    }
}
