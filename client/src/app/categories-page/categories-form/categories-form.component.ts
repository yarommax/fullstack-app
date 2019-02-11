import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Category } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {
  //получить доступ к input в html через декоратор viewchild
  @ViewChild('input') inputRef: ElementRef
  form: FormGroup
  image: File

  //any or = ''
  imagePreview: any
  isNew = true
  category: Category

  constructor(	private route: ActivatedRoute,
				private categoriesService: CategoriesService,
				private router: Router) { }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.form.disable()

    //последовательные запросы
    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }

            return of(null)
          }
        )
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }

          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )
  }


  triggerClick() {
    //через референцию мы вызываем у нативного 
    //элемента собатие клик 
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }

  onSubmit() {
    let obs$
    this.form.disable()
    
    if(this.isNew) {      
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id,this.form.value.name, this.image) 
    }

    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Изменения сохранены')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

  deleteCategory() {
	const decision = window.confirm(`Вы уверены, что хотите удалить категорию "${this.category.name}"`)
	if (decision) {
		this.categoriesService.delete(this.category._id)
		.subscribe(
			response => MaterialService.toast(response.message),
			error => MaterialService.toast(error.error.message),
			() => this.router.navigate(['/categories'])
		)
	}
  }
}
