import { CommonModule } from '@angular/common';
import { ApplicationRef, ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemons-page',
  standalone: true,
  imports: [
    CommonModule,
    PokemonListComponent,
    PokemonListSkeletonComponent
  ],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit{

  pokemons = signal<SimplePokemon[]>([])


  private pokemonsService = inject(PokemonsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);

  currentPage = toSignal<number>(this.route.queryParamMap.pipe(
    map(params => params.get('page') ?? '1'),
    map(page => isNaN(+page) ? 1 : +page),
    map(page => Math.max(1, page))
  ))
  // private appRef = inject(ApplicationRef);
  // private $appState = this.appRef.isStable.subscribe(isStable => {
  //   console.log(isStable);
  // })

  ngOnInit(): void {
    console.log(this.currentPage());

    // this.route.queryParamMap.subscribe(params => console.log())
    this.loadPokemons();
    // setTimeout(() => {
    //   this.isLoading.set(false);
    // }, 5000);
  }

  loadPokemons(nextPage: number = 0){
    const pageToLoad = this.currentPage()! + nextPage;
    this.pokemonsService.loadPage(pageToLoad)
    .pipe(
      tap(() => this.router.navigate([], {queryParams: {page: pageToLoad}})),
      tap(() => this.title.setTitle(`Pokémons SSR - Page ${pageToLoad}`))
    )
    .subscribe(pokemons => this.pokemons.set(pokemons))
  }
 }
