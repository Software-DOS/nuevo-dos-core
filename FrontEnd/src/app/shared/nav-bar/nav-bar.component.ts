import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Imenu } from 'src/app/interface/imenu';
import { MenuService } from 'src/app/services/menu.service';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterViewInit, OnDestroy {

  public usuario:any="";
  public menu:any=[];
  public submenu:any=[];
  public submenuFinal:any=[];
  public cadena:string = "";
  public Imagen:string = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Imagen por defecto
  
  constructor(
    private router: Router, 
    private menuService: MenuService,
    private gthEmpleadoService: GthEmpleadoService
  ) { }

  ngOnInit(): void {
    // ════════════════════════════════════════════════════════════════════
    // 🎨 CONFIGURACIÓN INICIAL DE PÁGINA
    // ════════════════════════════════════════════════════════════════════
    
    // Establecer atributos de datos de la página para colores
    this.setPageDataAttribute();
    
    // Escuchar cambios de ruta para actualizar colores de página
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setPageDataAttribute();
    });
    
    // ════════════════════════════════════════════════════════════════════
    // 📸 ESCUCHAR CAMBIOS EN LA FOTO DE PERFIL
    // ════════════════════════════════════════════════════════════════════
    
    this.gthEmpleadoService.fotoPerfilCambiada$.subscribe({
      next: (cambio) => {
        //BORRAR - PRODUCCIÓN: console.log('NavBar: Recibido cambio de foto de perfil:', cambio);
        this.Imagen = cambio.nuevaUrl;
      },
      error: (error) => {
        console.error('NavBar: Error al recibir cambio de foto:', error);
      }
    });
    
    // ════════════════════════════════════════════════════════════════════
    // 🔐 OBTENER Y PROCESAR TOKEN
    // ════════════════════════════════════════════════════════════════════
    
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      console.warn('NavBar: No se encontró token en sessionStorage');
      return;
    }
    
    try {
      // ──────────────────────────────────────────────────────────────────
      // 🔓 DECODIFICAR TOKEN JWT
      // ──────────────────────────────────────────────────────────────────
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      
      //BORRAR - PRODUCCIÓN: console.log("=" .repeat(60));
      //BORRAR - PRODUCCIÓN: console.log("🔍 [DEBUG] VERIFICACIÓN COMPLETA DEL TOKEN");
      //BORRAR - PRODUCCIÓN: console.log("=" .repeat(60));
      //BORRAR - PRODUCCIÓN: console.log("\n📋 [DEBUG] CONTENIDO COMPLETO DEL TOKEN:");
      //BORRAR - PRODUCCIÓN: console.log(JSON.stringify(tokenData, null, 2));
      
      // ──────────────────────────────────────────────────────────────────
      // 📧 EXTRAER EMAIL DEL TOKEN (en diferentes formatos posibles)
      // ──────────────────────────────────────────────────────────────────
      const email = tokenData['email'] || 
                    tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                    tokenData['Email'];
      
      //BORRAR - PRODUCCIÓN: console.log("📧 Email extraído:", email);
      
      // ──────────────────────────────────────────────────────────────────
      // 🆔 EXTRAER ID EMPLEADO DEL TOKEN
      // ──────────────────────────────────────────────────────────────────
      const idEmpleado = tokenData['IdEmpleado'] || 
                        tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      
      //BORRAR - PRODUCCIÓN: console.log("🆔 IdEmpleado extraído:", idEmpleado);
      //BORRAR - PRODUCCIÓN: console.log("👤 NombresApellidos:", tokenData['NombresApellidos']);
      //BORRAR - PRODUCCIÓN: console.log("🏢 IdEmpresa:", tokenData['IdEmpresa']);
      
      // ──────────────────────────────────────────────────────────────────
      // 👤 ASIGNAR NOMBRE DEL USUARIO
      // ──────────────────────────────────────────────────────────────────
      this.usuario = tokenData['NombresApellidos'] || email || 'Usuario';
      
      // ──────────────────────────────────────────────────────────────────
      // 📸 CARGAR FOTO DE PERFIL
      // ──────────────────────────────────────────────────────────────────
      
      // Intentar obtener ID desde el servicio primero
      const idFromService = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
      //BORRAR - PRODUCCIÓN: console.log('NavBar: ID desde service:', idFromService);
      //BORRAR - PRODUCCIÓN: console.log('NavBar: ID desde token:', idEmpleado);
      
      // Usar ID del servicio si existe, sino usar del token
      const idParaCargar = idFromService || idEmpleado;
      
      if (idParaCargar) {
        this.cargarFotoPerfilEmpleado(idParaCargar);
      }
      
      // ──────────────────────────────────────────────────────────────────
      // 📋 CARGAR MENÚ DEL EMPLEADO
      // ──────────────────────────────────────────────────────────────────
      
      if (!idEmpleado) {
        console.error('NavBar: No se pudo obtener IdEmpleado del token');
        return;
      }
      
      this.menuService.cargarMenu(idEmpleado).subscribe({
        next: (resp: any) => {
          this.menu = resp['$values'] || resp || [];
          //BORRAR - PRODUCCIÓN: console.log('NavBar: Menú cargado exitosamente. Items:', this.menu.length);
        },
        error: (err) => {
          console.error('NavBar: Error al cargar menú:', err);
        }
      });
      
    } catch (error) {
      console.error('NavBar: Error al procesar token:', error);
    }
  }

  private setPageDataAttribute(): void {
    const currentUrl = this.router.url;
    let pageType = 'dashboard';
    
    // Map Angular routes to page types for colors
    if (currentUrl.includes('/lista-empleados') || currentUrl.includes('/admin-cv')) {
      pageType = 'profiles';
    } else if (currentUrl.includes('/empleado-cv')) {
      pageType = 'cv';
    } else if (currentUrl.includes('/lista-capacitaciones') || currentUrl.includes('/empleado-capacitaciones')) {
      pageType = 'training';
    } else if (currentUrl.includes('/lista-evaluaciones') || currentUrl.includes('/evaluacion') || currentUrl.includes('/lista-aplicantes')) {
      pageType = 'evaluation';
    } else if (currentUrl === '/' || currentUrl === '/home') {
      pageType = 'dashboard';
    }
    
    // Set the data-page attribute on body for CSS styling
    document.body.setAttribute('data-page', pageType);
  }

  //Filtrar menus
  findSubMenu(submenuFinal: any[],id:number): any[] {
    return submenuFinal.filter(p => p.Imenu=id);
  }
  //cerrar sesion
  logout(){
      this.dropdownAbierto = false; // Close dropdown when logging out
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.router.navigateByUrl("/login");
  }

  /**
   * Carga la foto de perfil del empleado desde el backend
   * @param idEmpleado - ID del empleado logueado
   */
  // cargarFotoPerfilEmpleado(idEmpleado: number): void {
  //   console.log('NavBar: Intentando cargar foto para empleado ID:', idEmpleado);
    
  //   if (idEmpleado) {
  //     this.gthEmpleadoService.obtenerFotoPerfil(idEmpleado).subscribe({
  //       next: (response: any) => {
  //         console.log('NavBar: Respuesta del backend para foto:', response);
          
  //         if (response && response.fotoPerfilUrl) {
  //           const urlCompleta = this.gthEmpleadoService.construirUrlImagen(response.fotoPerfilUrl);
  //           console.log('NavBar: URL construida para imagen:', urlCompleta);
  //           this.Imagen = urlCompleta;
  //         } else {
  //           console.log('NavBar: No hay foto de perfil, usando imagen por defecto');
  //           // Mantener imagen por defecto si no tiene foto
  //           this.Imagen = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  //         }
  //       },
  //       error: (error) => {
  //         console.error('NavBar: Error al cargar foto de perfil:', error);
  //         // Mantener imagen por defecto en caso de error
  //         this.Imagen = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  //       }
  //     });
  //   } else {
  //     console.warn('NavBar: No se proporcionó ID de empleado válido');
  //     this.Imagen = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  //   }
  // }
  cargarFotoPerfilEmpleado(idEmpleado: number): void {
    // console.log('NavBar: Intentando cargar foto para empleado ID:', idEmpleado);

    if (!idEmpleado) {
      // console.warn('NavBar: No se proporcionó ID de empleado válido');
      this.Imagen = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
      return;
    }

    this.gthEmpleadoService.obtenerFotoPerfil(idEmpleado).subscribe({
      next: (response: any) => {
        // console.log('NavBar: Respuesta del backend para foto:', response);

        if (response && response.fotoPerfilUrl) {
          // si el backend ya devuelve la URL completa, usarla directamente
          this.Imagen = this.gthEmpleadoService.construirUrlImagen(response.fotoPerfilUrl);
        } else {
          console.log('NavBar: No hay foto de perfil, usando imagen por defecto');
          this.Imagen = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        }
      },
      error: (error) => {
        console.error('NavBar: Error al cargar foto de perfil:', error);
        this.Imagen = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
      }
    });
  }

  dropdownAbierto = false;

  toggleDropdown() {
    this.dropdownAbierto = !this.dropdownAbierto;
    
    if (this.dropdownAbierto) {
      // Use setTimeout to ensure DOM is updated before positioning
      setTimeout(() => {
        this.adjustDropdownPosition();
      }, 10);
    }
  }
  private adjustDropdownPosition(): void {
    const dropdown = document.getElementById('profileMenu');
    const profileDropdown = dropdown?.parentElement;
    
    if (!dropdown || !profileDropdown) return;

    // Reset positioning classes
    dropdown.classList.remove('dropdown-right', 'dropdown-left', 'dropdown-up');
    
    // Force a reflow to get accurate measurements
    dropdown.offsetHeight;
    
    const dropdownRect = dropdown.getBoundingClientRect();
    const profileRect = profileDropdown.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const MARGIN = 10; // Safety margin from viewport edges

    // Check horizontal overflow (dropdown going off right edge)
    if (dropdownRect.right > viewportWidth - MARGIN) {
      dropdown.classList.add('dropdown-left');
    }
    
    // Check if we need to position dropdown to the right instead
    if (dropdownRect.left < MARGIN && !dropdown.classList.contains('dropdown-left')) {
      dropdown.classList.add('dropdown-right');
    }

    // Recheck vertical position after horizontal adjustments
    const updatedDropdownRect = dropdown.getBoundingClientRect();
    
    // Check if dropdown goes below viewport (position above if needed)
    if (updatedDropdownRect.bottom > viewportHeight - MARGIN) {
      dropdown.classList.add('dropdown-up');
    }
    
    // If positioning up would cause it to go above viewport, keep it down but adjust
    const finalRect = dropdown.getBoundingClientRect();
    if (finalRect.top < MARGIN && dropdown.classList.contains('dropdown-up')) {
      dropdown.classList.remove('dropdown-up');
      // Reduce max-height to fit within remaining viewport height
      const availableHeight = viewportHeight - profileRect.bottom - MARGIN;
      dropdown.style.maxHeight = `${Math.max(200, availableHeight)}px`;
    }

    console.log('Dropdown positioned:', {
      dropdownRect: updatedDropdownRect,
      viewportWidth: viewportWidth,
      viewportHeight: viewportHeight,
      classes: dropdown.className
    });
  }

  // Close dropdown when clicking outside
  private handleClickOutside = (event: Event) => {
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown && !profileDropdown.contains(event.target as Node)) {
      this.dropdownAbierto = false;
    }
  }

  ngAfterViewInit(): void {
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('resize', () => {
      if (this.dropdownAbierto) {
        setTimeout(() => this.adjustDropdownPosition(), 10);
      }
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
