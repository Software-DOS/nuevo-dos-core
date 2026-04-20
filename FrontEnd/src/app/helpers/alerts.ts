import Swal,{SweetAlertIcon} from "sweetalert2";

export class alerts{

    static basicAlert(title:string,text:string,icon:SweetAlertIcon){
        Swal.fire(title,text,icon);
    }

    static confirmarAlert(title:string,text:string,icon:SweetAlertIcon,callback: Function): any {
     let resultado="";

     Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonText: 'SI',
        cancelButtonText: 'NO'
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            title,
            text,
            'success'
          )
          return callback(true);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'Quedo salvo',
            'error'
          )
          return callback(false);
        }
      })
    }

    
    
     // Mensaje de error (equivalente a MensajeIncorrecto)
    static mensajeIncorrecto(resultado: string): void {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `¡Algo salió mal...! ${resultado}`,
            width: '700px',
            heightAuto: false,
            customClass: {
                popup: 'swal-height-300'
            }
        });
    }
    
    // Mensaje de éxito (equivalente a MensajeCorrecto)
    static mensajeCorrecto(resultado: string): void {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: resultado,
            width: '700px',
            heightAuto: false,
            customClass: {
                popup: 'swal-height-300'
            }
        });
    }
    
    // Mensaje de alerta con timer (equivalente a MensajeAlerta)
    static mensajeAlerta(resultado: string): void {
        let timerInterval: any;
        
        Swal.fire({
            icon: 'warning',
            title: "Importante...!!!",
            text: resultado,
            timer: 3000,
            timerProgressBar: true,
            width: '700px',
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
                const popup = Swal.getPopup();
                if (popup) {
                    const timer = popup.querySelector("b");
                    if (timer) {
                        timerInterval = setInterval(() => {
                            const timeLeft = Swal.getTimerLeft();
                            timer.textContent = timeLeft ? `${Math.ceil(timeLeft / 1000)}` : '0';
                        }, 100);
                    }
                }
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        });
    }
    
    // Funciones adicionales útiles
    
    // Alert simple de éxito
    static exito(mensaje: string): void {
        this.mensajeCorrecto(mensaje);
    }
    
    // Alert simple de error
    static error(mensaje: string): void {
        this.mensajeIncorrecto(mensaje);
    }
    
    // Alert simple de información
    static info(mensaje: string): void {
        this.basicAlert('Información', mensaje, 'info');
    }
    
    // Alert simple de advertencia
    static warning(mensaje: string): void {
        this.basicAlert('Advertencia', mensaje, 'warning');
    }
    
    // Confirmación simple que retorna Promise
    static async confirmar(
        mensaje: string, 
        titulo: string = 'Confirmar acción'
    ): Promise<boolean> {
        const result = await Swal.fire({
            title: titulo,
            text: mensaje,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'SÍ',
            cancelButtonText: 'NO',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        });
        
        return result.isConfirmed;
    }
    
    // Loading/Cargando
    static mostrarCargando(titulo: string = 'Cargando...'): void {
        Swal.fire({
            title: titulo,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }
    
    // Cerrar loading
    static cerrarCargando(): void {
        Swal.close();
    }
    
    // Toast notification (esquina superior derecha)
    static toast(mensaje: string, icon: SweetAlertIcon = 'success'): void {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
        
        Toast.fire({
            icon: icon,
            title: mensaje
        });
    }
}
