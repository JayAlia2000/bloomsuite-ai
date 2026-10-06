DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Anyone can submit valid feedback" ON public.feedback
FOR INSERT TO anon, authenticated
WITH CHECK (
  (user_id IS NULL OR user_id = auth.uid())
  AND (coalesce(length(what_you_like),0) + coalesce(length(what_confused_you),0) + coalesce(length(feature_request),0)) > 0
  AND coalesce(length(what_you_like),0) <= 2000
  AND coalesce(length(what_confused_you),0) <= 2000
  AND coalesce(length(feature_request),0) <= 2000
);