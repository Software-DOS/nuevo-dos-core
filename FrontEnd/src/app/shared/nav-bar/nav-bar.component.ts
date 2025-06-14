import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Imenu } from 'src/app/interface/imenu';
import { MenuService } from 'src/app/services/menu.service';
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
  public Imagen:string = "";
  
  constructor(private router: Router, private menuService: MenuService) { }

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
      this.Imagen = "assets/img/" + IdEmpleado['Imagen'];
      
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
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.router.navigateByUrl("/login");
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
    
    const dropdownRect = dropdown.getBoundingClientRect();
    const profileRect = profileDropdown.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Check horizontal overflow (dropdown going off right edge)
    if (dropdownRect.right > viewportWidth - 10) {
      dropdown.classList.add('dropdown-left');
    }

    // Check if dropdown goes below viewport
    if (dropdownRect.bottom > viewportHeight - 10) {
      dropdown.classList.add('dropdown-up');
    }

    console.log('Dropdown positioned:', {
      dropdownRight: dropdownRect.right,
      viewportWidth: viewportWidth,
      dropdownBottom: dropdownRect.bottom,
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
