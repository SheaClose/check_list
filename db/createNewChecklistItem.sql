insert into checklist_items (name)
values ($1) returning id;
insert into checklist_users_items (checklists_id, item_id, user_id)
values ($2, lastval(), $3) returning checklists_id;
select * 
from checklist_items 
where id in (
  select item_id 
  from checklist_users_items 
  where checklists_id = $2
);

