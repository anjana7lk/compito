import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { environment } from '../../../../../../../apps/compito/src/environments/environment';
import { OrgSelectionService } from './org-selection.service';

@Component({
  selector: 'compito-org-selection',
  template: `
    <main class="grid org-selection">
      <div class="grid place-items-center relative">
        <div class="flex items-center absolute top-10 left-10">
          <img src="assets/images/logo-full.svg" alt="Compito" width="150" height="55" class="rounded-full" />
        </div>
        <section class="flex flex-col items-center">
          <img src="assets/images/welcome.svg" alt="Welcome" height="350" width="350" />
          <div class="flex items-center space-x-2">
            <h1 class="text-4xl font-bold">Login Successful!</h1>
            <div class="bg-green-500 rounded-full p-1 text-white">
              <rmx-icon class="" name="arrow-right-line"></rmx-icon>
            </div>
          </div>
          <p class="mt-2 text-gray-500">Choose which org to access</p>
        </section>
      </div>
      <div class="overflow-y-auto grid place-items-center bg-gray-100">
        <div class="w-full px-8 2xl:px-10">
          <section class="mb-10">
            <ng-container
              *ngTemplateOutlet="
                sectionHeader;
                context: {
                  $implicit: 'Your Orgs',
                  subtitle: 'You are part of multiple Orgs, Click on any one org to login'
                }
              "
            ></ng-container>
            <div class="orgs__list">
              <ng-container *ngFor="let item of orgs$ | async">
                <article
                  (click)="loginToOrg(item.id)"
                  tabindex="0"
                  class="p-4 relative rounded-md border cursor-pointer transition-all hover:shadow-lg duration-200 ease-in
                     border-gray-100 bg-white shadow-sm ring-primary hover:ring-2 focus:ring-2 outline-none"
                >
                  <header class="flex items-center justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <p class="text-md font-medium cursor-pointer hover:text-primary">{{ item?.name }}</p>
                      </div>
                      <p class=" text-xs text-gray-400 ">
                        Owner
                        <span class="font-medium text-gray-600">{{
                          item?.createdBy?.email === (userEmail$ | async) ? 'You' : item?.createdBy?.firstName
                        }}</span>
                      </p>
                    </div>
                  </header>
                  <div class="my-4">
                    <!-- <compito-user-avatar-group [data]="[]"></compito-user-avatar-group> -->
                  </div>
                  <footer class="flex items-center justify-between text-xs text-gray-400 mt-4">
                    <p>
                      Last Updated
                      <span class="font-medium text-gray-600">{{ item?.updatedAt | timeAgo }}</span>
                    </p>
                  </footer>
                </article>
              </ng-container>
            </div>
          </section>
          <section>
            <ng-container
              *ngTemplateOutlet="
                sectionHeader;
                context: {
                  $implicit: 'Pending Invites',
                  subtitle: 'You have pending invites. You can log into them once accepted'
                }
              "
            ></ng-container>
            <div class="invites__list">
              <ng-container *ngFor="let item of invites$ | async">
                <article
                  class="p-4 relative rounded-md border transition-all duration-200 ease-in
                     border-gray-100 bg-white shadow-sm"
                >
                  <header class="">
                    <div>
                      <div class="flex items-center justify-between">
                        <p class="text-md font-medium cursor-pointer hover:text-primary">Sreyaj</p>
                      </div>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      <p>
                        Invited
                        <span class="font-medium text-gray-600">2 days ago</span> by
                        <span class="font-medium text-gray-600">John Doe</span>
                      </p>
                      <p>
                        as
                        <span class="font-medium text-gray-600">Org Admin</span>
                      </p>
                    </div>
                  </header>
                  <footer class="flex justify-end space-x-4 mt-6">
                    <button btn size="sm" type="button" variant="secondary" (click)="({})">Reject</button>
                    <button btn size="sm" type="submit" form="orgForm" variant="primary">Accept & Login</button>
                  </footer>
                </article>
              </ng-container>
            </div>
          </section>
        </div>
      </div>
    </main>

    <ng-template #sectionHeader let-title let-subtitle="subtitle">
      <header>
        <h2 class="font-bold text-xl">{{ title }}</h2>
        <p class="text-gray-500">{{ subtitle }}</p>
      </header>
    </ng-template>
  `,
  styles: [
    `
      header.main {
        @apply flex justify-between items-center px-4 px-4 lg:px-8 bg-white xl:px-20;
        height: 80px;
      }
      main.org-selection {
        height: 100vh;
        grid-template-columns: 3fr 5fr;
      }
      .orgs {
        &__list {
          @apply pt-8;
          @apply grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4;
        }
      }
      .invites {
        &__list {
          @apply pt-8;
          @apply grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgSelectionComponent implements OnInit {
  orgSubject = new BehaviorSubject<any[]>([]);
  orgs$ = this.orgSubject.asObservable();
  inviteSubject = new BehaviorSubject<any[]>([]);
  invites$ = this.inviteSubject.asObservable();

  userEmail$ = this.auth.user$.pipe(pluck('email'));
  constructor(
    private orgService: OrgSelectionService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.sessionToken) {
      this.orgService.getOnboardingDetails(this.sessionToken).subscribe((data: any) => {
        if (data.orgs) {
          this.orgSubject.next(data.orgs);
        }
        if (data.invites) {
          this.inviteSubject.next(data.invites);
        }
      });
    }
  }

  loginToOrg(orgId: string) {
    window.location.href = `https://${environment.auth.domain}/continue?state=${this.state}&orgId=${orgId}`;
  }

  private get sessionToken() {
    return this.activatedRoute.snapshot.queryParams['session_token'];
  }
  private get state() {
    return this.activatedRoute.snapshot.queryParams['state'];
  }
}
