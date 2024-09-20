import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemons-page',
  standalone: true,
  imports: [
    CommonModule,
    PokemonListComponent,
    PokemonListSkeletonComponent,
    RouterLink
  ],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent{

  pokemons = signal<SimplePokemon[]>([])


  private pokemonsService = inject(PokemonsService);
  private route = inject(ActivatedRoute);
  private title = inject(Title);

  currentPage = toSignal<number>(this.route.params.pipe(
    map(params => params['page'] ?? '1'),
    map(page => isNaN(+page) ? 1 : +page),
    map(page => Math.max(1, page))
  ))

  loadOnPAgeChange = effect(() => {
    this.loadPokemons(this.currentPage());
  }, {
    allowSignalWrites: true
  });


  loadPokemons(nextPage: number = 0){
    this.pokemonsService.loadPage(nextPage)
    .pipe(
      tap(() => this.title.setTitle(`Pokémons SSR - Page ${nextPage}`))
    )
    .subscribe(pokemons => this.pokemons.set(pokemons))
  }
 }
