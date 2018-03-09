select * 
from checklist_items 
where id in (
  select item_id 
  from checklist_users_items 
  where checklists_id = $1
);

