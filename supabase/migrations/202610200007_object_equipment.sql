BEGIN;
CREATE TABLE public.site_object_equipment(
 object_id text PRIMARY KEY REFERENCES public.site_objects(id) ON DELETE CASCADE,
 enabled boolean NOT NULL DEFAULT false,
 title text NOT NULL CHECK(char_length(title) BETWEEN 1 AND 400),
 columns jsonb NOT NULL CHECK(jsonb_typeof(columns)='array' AND jsonb_array_length(columns) BETWEEN 1 AND 8),
 rows jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(rows)='array' AND jsonb_array_length(rows)<=100),
 description text NOT NULL DEFAULT '' CHECK(char_length(description)<=10000),
 revision bigint NOT NULL DEFAULT 1 CHECK(revision>0),updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_object_equipment ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_object_equipment FROM anon,authenticated;
GRANT SELECT ON public.site_object_equipment TO anon,authenticated;
GRANT ALL ON public.site_object_equipment TO service_role;
CREATE POLICY "Published object equipment is public" ON public.site_object_equipment FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.site_objects o WHERE o.id=object_id AND o.published));
INSERT INTO public.site_object_equipment(object_id,enabled,title,columns,rows,description) SELECT id,true,'Количество обслуживаемого оборудования:
41 единица оборудования.','[{"id": "equipment", "title": "Оборудование"}, {"id": "quantity", "title": "Кол-во"}]'::jsonb,'[{"id": "equipment-1", "cells": ["Водонагреватели Thermex 10", "10"]}, {"id": "equipment-2", "cells": ["Картофелечистка МОК-300МХ", "1"]}, {"id": "equipment-3", "cells": ["Холодильники Nord, Саратов, Indesit, Орск 19", "19"]}, {"id": "equipment-4", "cells": ["Жарочный кондитерский шкаф 1", "1"]}, {"id": "equipment-5", "cells": ["Электрические плиты ПЭМ-4-010", "5"]}, {"id": "equipment-6", "cells": ["Мясорубки", "5"]}]'::jsonb,'На объекте обслуживается значительный парк холодильного, теплового и электромеханического оборудования. В рамках работ выполняются плановые осмотры и профилактика, диагностика электрических и механических узлов, устранение неисправностей, ремонт и замена комплектующих с последующей проверкой оборудования в работе.' FROM public.site_objects WHERE id='botkin' ON CONFLICT(object_id) DO NOTHING;
NOTIFY pgrst,'reload schema';
COMMIT;
