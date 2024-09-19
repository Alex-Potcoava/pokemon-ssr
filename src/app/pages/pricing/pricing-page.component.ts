import { isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { log } from 'node:console';

@Component({
  selector: 'page-pricing',
  standalone: true,
  imports: [],
  templateUrl: './pricing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PricingPageComponent implements OnInit{

  private title = inject(Title);
  private meta = inject(Meta);
  private platform= inject(PLATFORM_ID)

  ngOnInit(): void {
    this.title.setTitle('Pricing Page');
    this.meta.updateTag({name: 'description', content: 'Este es mi about page'});
    this.meta.updateTag({name: 'og:title', content: 'About Page'});
    this.meta.updateTag({name: 'keywords', content: 'Lo que queramos'});
  }}
