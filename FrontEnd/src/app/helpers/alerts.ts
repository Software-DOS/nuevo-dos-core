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

}