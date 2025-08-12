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
    // Set initial page data attribute for colors
    this.setPageDataAttribute();
    
    // Listen to route changes to update page colors
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setPageDataAttribute();
    });

    const valor = sessionStorage.getItem('token');
    if (typeof valor === 'string') {
      var IdEmpleado =JSON.parse(atob(valor.split('.')[1]));
      this.usuario = IdEmpleado['NombresApellidos'];
      
      // Cargar foto de perfil del empleado usando el mismo método que empleado-cv
      const idEmpleadoFromService = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
      console.log('NavBar: ID desde service ->', idEmpleadoFromService);
      console.log('NavBar: ID desde token manual ->', IdEmpleado['IdEmpleado']);
      
      if (idEmpleadoFromService) {
        this.cargarFotoPerfilEmpleado(idEmpleadoFromService);
      } else {
        // Fallback al método manual si el servicio no funciona
        this.cargarFotoPerfilEmpleado(IdEmpleado['IdEmpleado']);
      }
      
      this.menuService.cargarMenu(IdEmpleado['IdEmpleado']).subscribe(
        (resp:any)=>{
            this.menu=resp['$values'];
            if (!localStorage.getItem('foo')) {
              localStorage.setItem('foo', 'no reload')
              location.reload()
            } else {
              localStorage.removeItem('foo')
            }
        },
        (err)=>{
          console.log("err:",err);
        }
      );
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
  cargarFotoPerfilEmpleado(idEmpleado: number): void {
    console.log('NavBar: Intentando cargar foto para empleado ID:', idEmpleado);
    
    if (idEmpleado) {
      this.gthEmpleadoService.obtenerFotoPerfil(idEmpleado).subscribe({
        next: (response: any) => {
          console.log('NavBar: Respuesta del backend para foto:', response);
          
          if (response && response.fotoPerfilUrl) {
            const urlCompleta = this.gthEmpleadoService.construirUrlImagen(response.fotoPerfilUrl);
            console.log('NavBar: URL construida para imagen:', urlCompleta);
            this.Imagen = urlCompleta;
          } else {
            console.log('NavBar: No hay foto de perfil, usando imagen por defecto');
            // Mantener imagen por defecto si no tiene foto
            this.Imagen = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
          }
        },
        error: (error) => {
          console.error('NavBar: Error al cargar foto de perfil:', error);
          // Mantener imagen por defecto en caso de error
          this.Imagen = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        }
      });
    } else {
      console.warn('NavBar: No se proporcionó ID de empleado válido');
      this.Imagen = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    }
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
